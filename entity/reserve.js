const sequelize = require("../tool/db/mysql")
const {DataTypes} = require("sequelize");

const machine = require("./machine")
const user = require("./user")
const reserve = sequelize.define("Reserve", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE
    },
    start: {
      type: DataTypes.TIME
    },
    end: {
        type: DataTypes.TIME
    },
    status: {
        type: DataTypes.STRING
    }
},{
    tableName: "reserve"
})

reserve.belongsTo(machine, {
    foreignKey: {
        name: "machine_id"
    }
})

reserve.belongsTo(user, {
    foreignKey: {
        name: "user_id"
    }
})

module.exports = reserve