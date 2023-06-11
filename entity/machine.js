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
    address: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    ip: {
        type: DataTypes.STRING
    }
},{
    tableName: "machine"
})


module.exports = machine