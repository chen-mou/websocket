const file = require("./file_upload"),
    user = require("./user"),
    machine = require("./machine"),
    reserve = require("./reserve")
    cors = require("cors");



module.exports = (app) => {
    app.use(cors(
        {
            origin: "*",
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: "*",
            credentials: true
        }
    ))
    app.use(require('express').json())
    file(app)
    user(app)
    machine(app)
    reserve(app)
}