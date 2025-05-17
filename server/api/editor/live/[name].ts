// import * as Y from 'yjs'
// // @ts-ignore (ws type mismatches, but it's compatible)
// import { setupWSConnection } from 'y-websocket/dist/src/utils'

// const docs = new Map<string, Y.Doc>()

// export default defineWebSocketHandler({
//     open(peer) {
//         console.log('opened WS for peer:', peer.id)
//         // Access the URL from the underlying HTTP request object
//         // const reqUrl = peer.raw.req.url || ''
//         // const roomName = reqUrl.substring(reqUrl.lastIndexOf('/') + 1)
//         const roomName = 'init-room' // Hardcoded room name

//         if (!roomName) {
//             console.error('Room name could not be determined. Closing connection.')
//             peer.close(1008, 'Room name required')
//             return
//         }

//         let doc = docs.get(roomName)
//         if (!doc) {
//             doc = new Y.Doc()
//             docs.set(roomName, doc)
//             console.log(`Created new Y.Doc for room: ${roomName}`)
//         } else {
//             console.log(`Using existing Y.Doc for room: ${roomName}`)
//         }

//         setupWSConnection(peer.websocket, (peer as any).raw.req, { doc })
//         console.log(`Yjs connection setup for peer ${peer.id} in room ${roomName}`)
//     },
//     close(peer) {
//         console.log('closed WS for peer:', peer.id)
//     },
//     error(peer, error) {
//         console.log('error on WS for peer:', peer.id, error)
//     },
//     message(peer, message) {
//         console.log('message on WS from peer:', peer.id, message.text())
//     }
// })
