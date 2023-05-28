const {Server} = require("socket.io"),
    rsa = require("../rsa")
let server
let userMap = {

}

let machineMap = {

}

module.exports = {
    init: function(httpServer){
        server = new Server(httpServer,{
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
                credentials: "true"
            }
        });
        server.on('connect', (socket) => {
            let token = socket.handshake.auth.token;
            let {id, type} = rsa.decode(token)
            switch (type){
                case "machine":
                    machineMap[id] = socket
                    break
                case "user":
                    userMap[id] = socket
                    break
            }
        })
    },
    server: server,
    sendMachine(machineId, method, data){
        machineMap[machineId].emit(method, data)
    },
    sendUser(userId, method, data){
        userMap[userId].emit(method, data)
    }
}