const axios = require('axios'),
    user = require('../entity/user'),
    jwt = require('../tool/jwt'),
    tool = require('../tool')

const secret = 'cba31045ebc9ee167f817c73bd8b73fe',
    appId = 'wx7c1a3d4e7e4fd84b'


async function login(req, res) {
    const body = req.body,
        code = body.code;
    let resp = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?secret=${secret}&appId=${appId}&js_code=${code}&grant_type=authorization_code`)
    const data = resp.data
    let id = data.openid
    if(id == null){
        throw data.errmsg
    }
    let r = await user.findOne({
        where: {
            open_id: id
        },
        limit: 1
    })
    if(r.length == 0){
        r = await user.create({
            open_id: id,
            nickname: "新用户"
        })
    }
    res.json({
        code: 0,
        data: r,
        token: jwt.encode({
            id: r.id
        })
    });
}



module.exports = (app) => {
    app.post("/user/login", tool.warp(login))
}