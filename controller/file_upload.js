const fs = require('fs'),
    machine = require('../entity/machine'),
    { generateKeyPairSync } = require('crypto');
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'top secret'
    }
});

function getPublicKey(req, res){
    res.jsonp({
        code:0,
        data: publicKey
    })
}

let fileUpload = (req, res) => {
    const body = req.body,
        file = req.file,
        name = req.name
    fs.writeFile("")
    res.jsonp({
        code : 0
    })
}

module.exports = (app) => {
    app.get("/getPublicKey", getPublicKey)
    app.use(/\/file|/, (req, res, next) => {
        const token = req.headers.token
        if(token == ""){
            res.jsonp({
                code: 1,
                data: "token不存在"
            })
            return
        }
        const id = crypto.publicDecrypt(privateKey, token);
        machine.findOne({
            where: {
                id: id
            }
        }).then((res) => {
            if(res != null){
                req.machine = res
                next()
            }
            res.jsonp({
                code: 1,
                data: "机器不存在"
            })
        })
    })
    app.post("/file/file_upload",  fileUpload)
}