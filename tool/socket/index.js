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
            try {
                let text = rsa.decode(token)
                console.log(text)
                let {id, type} = JSON.parse(text)
                switch (type) {
                    case "machine":
                        machineMap[id] = socket
                        break
                    case "user":
                        userMap[id] = socket
                        break
                }
            }catch (e){
                console.log(e)
            }
        })
    },
    server: server,
    sendMachine(machineId, method, data){
        if(machineMap[machineId] == null){
            return;
        }
        machineMap[machineId].emit(method, data)
    },
    sendUser(userId, method, data){
        if(machineMap[userId] == null){
            return;
        }
        userMap[userId].emit(method, data)
    }
}