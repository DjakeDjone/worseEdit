import { AdapterInternal, Peer } from 'crossws'

// server/routes/_ws.ts (or your chosen path)
import * as Y from 'yjs'
import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as map from 'lib0/map'

import { useUsersHandler } from '~/server/util/userHandler'
import { useDocsHandler } from '~/server/util/docsHandler'

const messageSync = 0
const messageAwareness = 1


export class WSSharedDoc extends Y.Doc {
    name: string
    conns: Map<any, Set<number>> // peer (from Nitro) will be the key
    awareness: awarenessProtocol.Awareness

    constructor(name: string) {
        super({ gc: true }) // Or configure GC as needed
        this.name = name
        this.conns = new Map()
        this.awareness = new awarenessProtocol.Awareness(this)
        this.awareness.setLocalState(null)

        const awarenessChangeHandler = ({ added, updated, removed }: any, conn: any) => {
            const changedClients = added.concat(updated, removed)
            if (conn !== null) { // conn is the peer object
                const connControlledIDs = this.conns.get(conn)
                if (connControlledIDs !== undefined) {
                    added.forEach((clientID: number) => { connControlledIDs.add(clientID) })
                    removed.forEach((clientID: number) => { connControlledIDs.delete(clientID) })
                }
            }
            // Broadcast awareness update
            const encoder = encoding.createEncoder()
            encoding.writeVarUint(encoder, messageAwareness)
            encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
            const buff = encoding.toUint8Array(encoder)
            this.conns.forEach((_, c) => { // c is the peer object
                try {
                    c.send(buff)
                } catch (e) {
                    this.closeConn(c)
                }
            })
        }
        this.awareness.on('update', awarenessChangeHandler)

        // Handle document updates and broadcast them
        this.on('update', (update: Uint8Array, origin: any) => {
            const encoder = encoding.createEncoder()
            encoding.writeVarUint(encoder, messageSync)
            syncProtocol.writeUpdate(encoder, update)
            const message = encoding.toUint8Array(encoder)
            this.conns.forEach((_, conn) => { // conn is the peer object
                // Only send to clients other than the origin if origin is a peer
                if (conn !== origin) {
                    try {
                        conn.send(message)
                    } catch (e) {
                        this.closeConn(conn)
                    }
                }
            })
        })

        // Optional: Debounced callback for persistence or other actions
        // if (isCallbackSet) {
        //   this.on('update', (update, origin, doc) => {
        //     debouncer(() => callbackHandler(doc as WSSharedDoc));
        //   });
        // }
    }

    closeConn(peer: any) {
        if (this.conns.has(peer)) {
            const controlledIds = this.conns.get(peer)!
            this.conns.delete(peer)
            awarenessProtocol.removeAwarenessStates(this.awareness, Array.from(controlledIds), null)
            if (this.conns.size === 0 /*&& persistence !== null*/) {
                // If persisted, you might want to store state and destroy ydocument
                // persistence.writeState(this.name, this).then(() => {
                //   this.destroy()
                // })
                // docs.delete(this.name)
            }
        }
        // Nitro handles peer closing, but you might want to log or perform additional cleanup
    }
}

const docs: Map<string, WSSharedDoc> = new Map()

export const getYDoc = (docname: string, gc = true): WSSharedDoc =>
    map.setIfUndefined(docs, docname, () => {
        const doc = new WSSharedDoc(docname)
        doc.gc = gc
        // if (persistence !== null) {
        //   persistence.bindState(docname, doc)
        // }
        docs.set(docname, doc)
        return doc
    })


export const getYDocName = (peer: Peer<AdapterInternal>) => {
    const urlParts = peer.websocket.url?.split('?')[0].split('/')
    if (!urlParts || urlParts.length < 2) {
        return 'default-room' // Fallback room name
    }
    const roomName = urlParts[urlParts.length - 1] // Extract the last part of the URL
    return roomName
}


export default defineWebSocketHandler({
    async open(peer) {
        console.log('[ws] open', peer)
        const roomName = getYDocName(peer);
        const { getUserByCookie } = useUsersHandler();
        const { getDoc: getDbDoc, checkDocPermissions } = useDocsHandler(); // Renamed to avoid conflict

        try {
            let user = null; // Initialize user as null

            // @ts-ignore: peer.event is available in crossws from H3Event, but might be undefined
            if (peer.event && typeof peer.event === 'object') {
                try {
                    // @ts-ignore: peer.event is available in crossws from H3Event
                    user = await getUserByCookie(peer.event);
                } catch (e: any) {
                    // Log error from getUserByCookie if it throws (e.g. 'Cannot read properties of undefined (reading 'node')')
                    // Treat as anonymous and proceed to check document permissions (e.g. public access)
                    console.warn(`[ws] Error during getUserByCookie for peer ${peer.id} (room: ${roomName}): ${e.message}. Proceeding as anonymous.`);
                    // user remains null
                }
            } else {
                console.warn(`[ws] peer.event is not available for peer ${peer.id} (room: ${roomName}). Proceeding as anonymous for cookie authentication.`);
                // user remains null
            }

            const dbDoc = await getDbDoc(roomName);
            if (!dbDoc) {
                console.error(`[ws] Unauthorized: Document ${roomName} not found for peer:`, peer.id);
                peer.close(1008, `Unauthorized: Document ${roomName} not found`);
                return;
            }

            if (user) {
                await checkDocPermissions(dbDoc, user); // This will throw if no permission
                console.log(`[ws] User ${user.id} authorized for document ${roomName}`);
            } else {
                // User is null (no cookie, peer.event missing/problematic, or getUserByCookie failed)
                // Check if the document is public
                if (dbDoc.public) {
                    console.log(`[ws] Document ${roomName} is public, allowing anonymous access for peer:`, peer.id);
                } else {
                    console.error(`[ws] Unauthorized: Document ${roomName} is not public and no authenticated user found for peer:`, peer.id);
                    peer.close(1008, `Unauthorized: Document ${roomName} requires authentication.`);
                    return;
                }
            }

            // If authorization passed, proceed with setting up Yjs doc connection
            const doc = getYDoc(roomName);
            doc.conns.set(peer, new Set());

            // Send sync step 1 (initial sync)
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeSyncStep1(encoder, doc);
            peer.send(encoding.toUint8Array(encoder));

            // Send awareness update (initial awareness state)
            const awarenessStates = doc.awareness.getStates();
            if (awarenessStates.size > 0) {
                const awarenessEncoder = encoding.createEncoder();
                encoding.writeVarUint(awarenessEncoder, messageAwareness);
                encoding.writeVarUint8Array(awarenessEncoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())));
                peer.send(encoding.toUint8Array(awarenessEncoder));
            }
        } catch (error: any) {
            // This catch block handles errors from getDbDoc, checkDocPermissions (if user was present and denied),
            // or other unexpected critical errors in the setup.
            console.error(`[ws] Authorization or setup error for peer ${peer.id} (room: ${roomName}): ${error.message}`);
            const closeMessage = error.message ? `Unauthorized: ${error.message}` : 'Unauthorized: Connection setup failed';
            peer.close(1008, closeMessage); // 1008: Policy Violation
            return;
        }
    },

    message(peer, message) {
        // console.log('[ws] message', peer, message)
        // const urlParts = peer.url.split('?')[0].split('/')
        const roomName = getYDocName(peer);
        const doc = getYDoc(roomName)
        const M_TEXT = message.text() // Not used by y-websocket-server which expects binary
        const M_DATA = message.data // Uint8Array if binary

        try {
            if (M_DATA instanceof Uint8Array) {
                const M_DATA = message.data as Uint8Array;
                const encoder = encoding.createEncoder()
                const decoder = decoding.createDecoder(M_DATA)
                const messageType = decoding.readVarUint(decoder)

                switch (messageType) {
                    case messageSync:
                        encoding.writeVarUint(encoder, messageSync)
                        // Pass `peer` as the origin for syncProtocol
                        syncProtocol.readSyncMessage(decoder, encoder, doc, peer)
                        if (encoding.length(encoder) > 1) {
                            peer.send(encoding.toUint8Array(encoder))
                        }
                        break
                    case messageAwareness:
                        awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), peer)
                        break
                    default:
                        console.warn('Unknown message type:', messageType)
                }
            } else {
                console.warn('Received non-binary message, Yjs expects binary data.');
            }
        } catch (err) {
            console.error('Error processing message:', err)
            // doc.emit('error', [err]) // Yjs Doc can emit an error event
        }
    },

    close(peer, event) {
        console.log('[ws] close', peer, event)
        // const urlParts = peer.url.split('?')[0].split('/')
        // const roomName = urlParts[urlParts.length -1] || 'default-room'
        const roomName = getYDocName(peer);

        const doc = getYDoc(roomName)
        doc.closeConn(peer)
    },

    error(peer, error) {
        console.log('[ws] error', peer, error)
        // const urlParts = peer.url.split('?')[0].split('/')
        // const roomName = urlParts[urlParts.length - 1] || 'default-room'
        const roomName = getYDocName(peer);

        const doc = getYDoc(roomName) // Get the doc to ensure cleanup if possible
        doc.closeConn(peer) // Attempt to clean up connection specific data in the doc
    },
})