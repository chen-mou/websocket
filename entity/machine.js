const sequelize = require('../tool/db/mysql')
const {DataTypes} = require('sequelize')

const machine = sequelize.define('Machine', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    num: {
        type: DataTypes.INTEGER,
    },
    latitude: {
        type: DataTypes.DOUBLE
    },
    longitude: {
        type: DataTypes.DOUBLE
    },
    status: {
        type: DataTypes.STRING
    }
},{
    tableName: "machine"
})


module.exports = machine