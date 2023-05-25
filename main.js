const {Server} = require("socket.io")
const Express = require("express")
const controller = require("controller")
const {createServer} = require("http")

const app = Express();

controller(app)

const httpServer = createServer(app)

const server = new Server(httpServer,{
    cors: {
        origin: "*",
        allowedHeaders: ["*"],
        credentials: "true"
    }
});

console.log("running")

server.use((socket, next) => {
    const token = socket.handshake.auth.token;

})

server.on('connect', (socket) => {
    console.log(socket);
})

httpServer.listen(16888)