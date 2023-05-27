const file = require("./file_upload"),
    user = require("./user"),
    machine = require("./machine");



module.exports = (app) => {

    app.use(require('express').json())
    file(app)
    user(app)
    machine(app)
}