const sequelize = require('../tool/db/mysql')
const {DataTypes} = require('sequelize')

const user = sequelize.define("User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        open_id: {
            type: DataTypes.STRING
        },
        nickname: {
            type: DataTypes.STRING
        }
    }
    ,
    {
    tableName: 'user'
})


module.exports = user
