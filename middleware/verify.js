const jwt = require("../tool/jwt"),
    user = require("../entity/user")

function verify(req, res, next){
    const token = req.headers.token || req.query.token || req.body.token
    if(token == "" || token == null){
        throw "未登录"
    }
    let data = jwt.decode(token)
    user.findByPk(data.id).then(res => {
        req.user = res
        next()
    })

}


module.exports = verify