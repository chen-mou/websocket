const index = require('jsonwebtoken')

const secret = "camera"

module.exports = {
    encode: (data) => {
        return index.sign(data, secret,{ expiresIn: 60 * 60})
    },
    decode: (token) => {
        try {
            let data = index.verify(token, secret)
            return data
        }catch (e){
            throw "token解析出错"
        }
    }
}