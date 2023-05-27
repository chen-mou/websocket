function warp(req, res, next){
    let f = async () => {
       next()
    }
    f().catch(err => {
        res.jsonp(
            {
                code: 1,
                err_msg: err
            }
        )
    })
}