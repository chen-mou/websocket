const fs = require('fs'),
    machine = require('../entity/machine'),
    reserve = require('../entity/reserve'),
    user = require('../entity/user'),
    rsa = require("../tool/rsa"),
    socket = require("../tool/socket"),
    multer = require("multer")
const {warp} = require("../tool"),
    prefix_url = "http://192.168.43.174:16888/file/get",
    basePath = "E:\\Code\\nodejs\\websocket\\img",
    upload = multer({storage: multer.memoryStorage()});
const {verify} = require("../middleware");

function getPublicKey(req, res){
    res.jsonp({
        code:0,
        data: rsa.publicKey
    })
}

const fileUpload = async (req, res) => {
    const body = req.body,
        file = req.file,
        path = `${basePath}\\${body.user_id}`
    if(!fsExistSync(path)){
        fs.mkdirSync(path)
    }
    const name = new Date().getTime();
    fs.writeFileSync(`${basePath}\\${body.user_id}\\${name}.png`, file.buffer)
    // socket.sendUser(user_id, "/complete", {
    //     uri: `${prefix_url}/${name}`
    // })

    await reserve.update({
        file: `${prefix_url}/${name}.png`
    },{
        where: {
            id: body.reserve_id
        }
    })
    res.jsonp({
        code : 0
    })
}

const fsExistSync = (path) => {
    try{
        fs.accessSync(path);
    }catch (e){
        return false;
    }
    return true;
}

const get = async (req, res) => {
    const userId = req.user.id,
        name = req.params.name
    res.sendFile(`E:\\Code\\nodejs\\websocket\\img\\${userId}\\${name}`)
}

module.exports = (app) => {
    app.get("/getPublicKey", getPublicKey)
    app.get("/file/get/:name",verify, warp(get))
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
    app.post("/file/file_upload", upload.single('file'), warp(fileUpload))
}