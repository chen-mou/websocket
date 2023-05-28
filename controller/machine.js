const machine = require("../entity/machine"),
    tool = require("../tool")

async function save(req, res){
    await machine.save(req.body)
    res.jsonp({
        code: 0,
    })
}

async function getAll(req, res){
    let r = await machine.findAll();
    res.jsonp(
        {
            code: 0,
            data: r
        }
    )
}

module.exports = (app) => {
    app.post("/machine/save", tool.warp(save))

    app.get("/machine/all", tool.warp(getAll))
}

// let data =  [
//     {
//         longitude: 112.938578,
//         latitude: 27.854044,
//         id: 1,
//         status: "正常",
//     },
//     {
//         longitude: 112.93777,
//         latitude:27.853833,
//         id: 2,
//         status: "正常"
//     },
//     {
//         longitude:112.937231,
//         latitude:27.852467,
//         id: 3,
//         status: "异常"
//     }
//
// ]
//
// data.forEach(item => {
//     machine.create(item)
// })