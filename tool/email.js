const nodemailer = require("nodemailer");
const form = "",
    transport = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 465,
        secure: true,
        auth: {
            user: form,
            pass: "",
        }
    })


let send = async (msg, to) => {
   await transport.sendMail({
        subject: "机器异常警告",
        from: form,
        to: to,
        text: "智能照相系统有机器发生异常！请及时处理！"
    })
}

send("", "1606019914@qq.com").then(value => {
    console.log("done")
})