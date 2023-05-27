const {Sequelize} = require("sequelize");
const sequelize = new Sequelize('mysql://root:200136Lyf.@8.130.122.134:3306/camera',{
    dialect: "mysql",
    dialectOptions: {

    }
})

module.exports = sequelize
