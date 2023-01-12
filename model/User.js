const { DataTypes, Sequelize, UUID } = require('sequelize');
const database = require('../database');

const User = database.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING
    },
    forgetToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    schema: 'demo'
})

module.exports = User;