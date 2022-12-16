const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db.config')

class Todo extends Model { }

Todo.init({
    title: {
        type: DataTypes.STRING,
        unique: true
    },
    desc: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    userid: {
        type: DataTypes.INTEGER
    },
}, {
    sequelize,
    modelName: 'Todo'
})

module.exports = Todo