const middleware = require("../middleware"),
    reserve = require("../entity/reserve"),
    machine = require("../entity/machine"),
    socket = require("../tool/socket"),
    tool = require("../tool"),
    {Op} = require("sequelize");
const moment = require("moment");
async function come(req, res){
    let body = req.body,
        user = req.user
    const f = (num, min) => {
        if(num < min){
            return `0${num}`
        }
        return num
    }
    const now = new Date(),
        nowTime = `${f(now.getHours(), 10)}:${f(now.getMinutes(), 10)}:${f(now.getSeconds(), 10)}`,
        nowDate = `${f(now.getFullYear(), 10)}-${f(now.getMonth(), 10)}-${f(now.getDate(), 10)}`
    let r = await reserve.findOne({
        where: {
            user_id: user.id,
            id: body.id,
            date: nowDate,
            [Op.and]: {
                start: {
                    [Op.lte]: nowTime
                },
                end: {
                    [Op.gte]: nowTime
                }
            }
        },
        include: machine
    })
    if(r == null){
        throw "预约不存在或还未到达指定时间"
    }
    socket.sendMachine(r.machine.id, "/start", {
        user_id: user.id,
        model: body.model
    })
    res.jsonp({
        code: 0
    });
}

async function create(req, res){
    const body = req.body,
        user = req.user
    let m = await machine.findOne({
        where:{
            id: body.machine_id
        }
    })
    if(m == null){
        throw "机器不存在"
    }
    let end = moment(`2023-05-27 ${body.start}`).add(15, 'minute').format("hh:mm:ss")
    let entity = {
        date: body.date,
        start: body.start,
        end: end,
        machine_id: body.machine_id,
        user_id: user.id
    }

    await reserve.create(entity)
    res.jsonp({
        code: 0
    })
}

async function getUserReserve(req, res){
    const id = req.user.id
    let reserves = await reserve.findAll({
        where: {
            user_id: id,
            [Op.not]: {
                status: "COMPLETE"
            }
        },
        include: machine
    })
    res.jsonp({
        code: 0,
        data: reserves
    })
}

module.exports = (app) => {
    app.use(/\/reserve|/, middleware.verify)

    app.post("/reserve/come", tool.warp(come))

    app.post("/reserve/create", tool.warp(create))

    app.get("/reserve/myReserve", tool.warp(getUserReserve()))
}