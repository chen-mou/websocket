

module.exports = {
    warp: (next) => {
       return (req, res) => {
           next.catch(err => {
               res.jsonp(
                   {
                       code: 1,
                       err_msg: err
                   }
               )
           })
       }
    }
}