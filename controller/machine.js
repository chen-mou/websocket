const machine = require("../entity/machine"),
    tool = require("../tool")
const sequelize = require("../tool/db/mysql");
const moment = require("moment");

async function save(req, res){
    await machine.save(req.body)
    res.jsonp({
        code: 0,
    })
}

async function getAll(req, res){
    let now = moment(new Date())
    let r = await machine.findAll({
        attributes:{
            include: [
                [
                    sequelize.literal(`(select count(*)
                                       from reserve
                                       where date = '${now.format("YYYY-MM-DD")}' and
                                       start > '${now.format("HH:mm:ss")}' and machine_id = Machine.id)`),
                    'num'
                ]
            ]
        }
    });
    res.jsonp(
        {
            code: 0,
            data: r
        }
    )
}

async function getByIp(req, res){
    let ips = req.connection.remoteAddress.split(":"),
        ip = ips[ips.length - 1]
    let m = await machine.findOne({
        where : {
            ip: ip
        }
    });
    res.jsonp({
        code: 0,
        data: m
    })
}


module.exports = (app) => {
    app.post("/machine/save", tool.warp(save))

    app.get("/machine/all", tool.warp(getAll))

    app.get("/machine/getByIp", tool.warp(getByIp))

}

// let data =  [
//     {
//         longitude: 112.938578,
//         latitude: 27.854044,
//         id: 1,
//         status: "正常",
//         address: "图书馆",
//         ip: '192.168.43.7',
//         num: 0,
//     },
//     {
//         longitude: 112.93777,
//         latitude:27.853833,
//         id: 2,
//         status: "正常",
//         address: "教学楼F座",
//         ip:'192.168.43.8',
//         num: 0
//     },
//     {
//         longitude:112.937231,
//         latitude:27.852467,
//         id: 3,
//         address: "教学楼B座",
//         status: "异常",
//         ip: '192.168.43.9',
//         num: 0
//     }
//
// ]
//
// data.forEach(item => {
//     machine.create(item)
// })