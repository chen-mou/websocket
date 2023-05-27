const jwt = require("../tool/jwt"),
    user = require("../entity/user")

function verify(req, res, next){
    const token = req.headers.token
    if(token == "" || token == null){
        throw "未登录"
    }
    let data = jwt.decode(token)
    user.findOne({
        where: {
            id: data.id
        }
    }).then(res => {
        req.user = res
        next()
    })

}


module.exports = verify