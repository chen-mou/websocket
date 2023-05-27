require("../user")
require("../machine")
require("../reserve")
const sequelize = require("../../tool/db/mysql")


sequelize.sync({force: true}).then(res => {
    console.log("done")
});