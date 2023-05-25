const multer = require("multer")

const upload = multer({
    dest: "../public"
})

let fileUpload = (req, res) => {
    res.jsonp({
        code : 0
    })
}

module.exports = (app) => {
    app.post("/file_upload", upload.single('file'), fileUpload)
}