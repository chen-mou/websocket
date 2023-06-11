const middleware = require("../middleware"),
    reserve = require("../entity/reserve"),
    machine = require("../entity/machine"),
    socket = require("../tool/socket"),
    tool = require("../tool"),
    {Op} = require("sequelize");
const moment = require("moment");
const {timeNumber} = require("../tool");

async function come(req, res) {
    let body = req.body,
        user = req.user
    const now = new Date(),
        nowTime = `${tool.timeNumber(now.getHours())}:${timeNumber(now.getMinutes())}:${timeNumber(now.getSeconds())}`,
        nowDate = `${tool.timeNumber(now.getFullYear(), 10)}-${timeNumber(now.getMonth() + 1)}-${timeNumber(now.getDate())}`
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
    if (r == null) {
        throw "预约不存在或还未到达指定时间"
    }
    r.file = null
    r.status = 'photoing'
    await r.save()
    res.jsonp({
        code: 0
    });
    socket.sendMachine(r.Machine.id, "/start", {
        user_id: user.id,
        reserve_id: r.id,
        model: body.model
    })
}

async function create(req, res) {
    const body = req.body,
        user = req.user
    let m = await machine.findByPk(body.machine_id)
    if (m == null) {
        throw "机器不存在"
    }
    let now = new Date()
    const timeStr = `${now.getFullYear()}-${tool.timeNumber(now.getMonth() + 1)}-${tool.timeNumber(now.getDate())} ${body.start}`;
    let time = moment(timeStr)
    if (time.unix() < new Date().getTime() / 1000) {
        throw "不能预约以前的时间"
    }
    let end = moment(timeStr).add(15, 'minute').format("HH:mm:ss")
    let start = time.format("HH:mm:ss")
    let date = time.format("YYYY-MM-DD")
    let r = await reserve.findOne({
        where: {
            date: date,
            machine_id: body.machine_id,
            [Op.or]: [
                {
                    start: {
                        [Op.between]: [start, end]
                    }
                },
                {
                    end: {
                        [Op.between]: [start, end]
                    }
                }
            ],
            status: 'unused'
        }
    })
    if (r != null) {
        throw "该时间段已经被预约了"
    }
    let entity = {
        date: date,
        start: start,
        end: end,
        machine_id: body.machine_id,
        user_id: user.id,
        status: 'unused'
    }

    await reserve.create(entity)
    res.jsonp({
        code: 0
    })
}

async function getUserReserve(req, res) {
    const id = req.user.id
    let reserves = await reserve.findAll({
        where: {
            user_id: id,
            status: {
                [Op.or]: ["unused", "photoing"]
            }
        },
        include: machine
    })
    res.jsonp({
        code: 0,
        data: reserves
    })
}

async function getReservePhoto(req, res) {
    let value = await reserve.findOne({
        where: {
            id: req.query.id,
            user_id: req.user.id
        },
        limit: 1
    })
    res.jsonp({
        code: value.file == null ? 1 : 0,
        data: value.file
    })
}

async function complete(req, res) {
    const body = req.body,
        userId = req.user.id,
        r = await reserve.findOne({
            where: {
                id: body.reserve_id,
                user_id: userId,
            }
        })
    if (r == null) {
        throw "预约不存在"
    }
    r.status = 'complete'
    await r.save()
    res.jsonp({
        code: 0
    });
}


async function getUserAllPhoto(req, res) {
    const userId = req.user.id
    let v = await reserve.findAll({
            attributes: ["file"],
            where: {
                user_id: userId,
                status: 'complete',
                file: {
                    [Op.not]: null
                }
            }
        }),
        r = [];
    v.forEach((item) => {
        r.push (item.file)
    })
    res.jsonp({
        code: 0,
        data: r
    })
}

function test(req, res) {
    socket.sendMachine(3, "/start", {
        model: "pose1",
        user_id: "1",

    })
    res.jsonp({code: 0})
}

module.exports = (app) => {

    app.get("/test/test", test)

    app.use(/\/reserve|/, middleware.verify)

    app.post("/reserve/come", tool.warp(come))

    app.post("/reserve/create", tool.warp(create))

    app.get("/reserve/myReserve", tool.warp(getUserReserve))

    app.get("/reserve/getReservePhoto", tool.warp(getReservePhoto))

    app.post("/reserve/complete", tool.warp(complete))

    app.get("/reserve/myPhotos", tool.warp(getUserAllPhoto))

    function update() {

        const now = moment(new Date()),
            time = now.format("HH:mm:ss"),
            date = now.format("YYYY-MM-DD");
        reserve.update({
            status: 'overdue',
        }, {
            where: {
                status: 'unused',
                [Op.or]: [
                    {
                        date: {
                            [Op.lt]: date
                        }
                    },
                    {
                        date: date,
                        end: {
                            [Op.lt]: time
                        }
                    }
                ]
            }
        })

        reserve.update({
            status: 'complete',
        }, {
            where: {
                status: 'photoing',
                [Op.or]: [
                    {
                        date: {
                            [Op.lt]: date
                        }
                    },
                    {
                        date: date,
                        end: {
                            [Op.lt]: time
                        }
                    }
                ]
            }
        })

        setTimeout(update, 60000)
    }

    setTimeout(update, 60000)
}