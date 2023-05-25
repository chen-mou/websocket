const {io} = require("socket.io-client")

const socket = io("http://localhost:16888");

socket.on('connect', () => {
    console.log(socket.connected)
})
