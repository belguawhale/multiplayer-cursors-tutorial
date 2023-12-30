import { User } from "../shared/User"
import WebSocket, { RawData, WebSocketServer } from "ws"
import http from "http"
import { v4 as uuidv4 } from "uuid"
import url from "url"

const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8000
const connections: { [uuid: string]: WebSocket } = {}
const users: { [uuid: string]: User } = {}

const handleMessage = (bytes: RawData, uuid: string) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    user.state = message
    broadcast()

    console.log(
        `${user.username} updated their updated state: ${JSON.stringify(
            user.state,
        )}`,
    )
}

const handleClose = (uuid: string) => {
    console.log(`${users[uuid].username} disconnected`)
    delete connections[uuid]
    delete users[uuid]
    broadcast()
}

const broadcast = () => {
    Object.keys(connections).forEach((uuid) => {
        const connection = connections[uuid]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}

wsServer.on("connection", (connection: WebSocket, request) => {
    const username = url.parse(request.url!, true).query.username as string;
    console.log(`${username} connected`)
    const uuid = uuidv4()
    connections[uuid] = connection
    users[uuid] = {
        username,
        state: { x: 0, y: 0 },
    }
    connection.on("message", (message) => handleMessage(message, uuid))
    connection.on("close", () => handleClose(uuid))
})

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`)
})