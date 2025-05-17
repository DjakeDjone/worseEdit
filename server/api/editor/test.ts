
const room = 'ROOM'
export default defineWebSocketHandler({
    open(peer) {
        console.log('opened WS')
        peer.subscribe(room)
        peer.publish(room, 'Another user joined the chat')
    },
    close(peer) {
        console.log('closed WS')
    },
    error(peer, error) {
        console.log('error on WS', error)
    },
    message(peer, message) {
        console.log('message on WS', message)
        peer.publish(room, message.text())
    }
})
