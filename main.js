const socket = require("./tool/socket")
const Express = require("express")
const controller = require("./controller")
const {createServer} = require("http")

const app = Express();

controller(app)

const httpServer = createServer(app)

socket.init(httpServer)

httpServer.listen(16888)