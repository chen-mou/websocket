

module.exports = {
    warp: (next) => {
       return (req, res) => {
           next(req, res).catch(err => {
               console.error(err)
               res.jsonp(
                   {
                       code: 1,
                       err_msg: err
                   }
               )
           })
       }
    },
    timeNumber: (v) => {
        if(v < 10){
            return `0${v}`
        }
        return v
    }
}