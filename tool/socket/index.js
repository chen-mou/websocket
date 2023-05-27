const {Server} = require("socket.io");
let server
let socketMap = {

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
           let machineId = socket.handshake.auth.machine_id;
            socketMap[machineId] = socket
        })
    },
    server: server,
    send(machineId, method, data){
        socketMap[machineId].emit(method, data)
    }
}