const fs = require('fs'),
    machine = require('../entity/machine'),
    user = require('../entity/user'),
    rsa = require("../tool/rsa"),
    socket = require("../tool/socket")
const {warp} = require("../tool"),
    prefix_url = "http://192.168.43.174:16888/file/get";

function getPublicKey(req, res){
    res.jsonp({
        code:0,
        data: rsa.publicKey
    })
}

const fileUpload = async (req, res) => {
    const body = req.body,
        {file, user_id, name} = body
    let dir = fs.statSync(`E:\\Code\\nodejs\\websocket\\img\\${user_id}`)
    if(!dir.isDirectory()){
        fs.mkdirSync(dir.path)
    }
    fs.writeFileSync(`E:\\Code\\nodejs\\websocket\\img\\${user_id}\\${name}`, file)
    socket.sendUser(user_id, "/complete", {
        uri: `${prefix_url}/${name}`
    })
    res.jsonp({
        code : 0
    })
}

const get = async (req, res) => {
    const userId = req.user.id,
        name = req.param.name
    res.sendFile(`E:\\Code\\nodejs\\websocket\\img\\${userId}\\${name}`)
}

module.exports = (app) => {
    app.get("/getPublicKey", getPublicKey)
    app.use(/\/file\/.*/, (req, res, next) => {
        const token = req.headers.token
        if(token == ""){
            res.jsonp({
                code: 1,
                data: "token不存在"
            })
            return
        }
        const {id, type} = JSON.parse(rsa.decode(token));
        switch (type) {
            case "machine":
                machine.findOne({
                    where: {
                        id: id
                    }
                }).then((res) => {
                    if (res != null) {
                        req.machine = res
                        next()
                        return
                    }
                    res.jsonp({
                        code: 1,
                        data: "机器不存在"
                    })
                })
                break
            case "user":
                user.findOne({
                    where: {
                        id: id
                    }
                }).then(res => {
                    if (res != null) {
                        req.user = res
                        next()
                        return
                    }
                    res.jsonp({
                        code: 1,
                        data: "用户不存在"
                    })
                })
        }
        })
    app.post("/file/file_upload",  warp(fileUpload))
    app.get("/file/get/:name", warp(get))
}