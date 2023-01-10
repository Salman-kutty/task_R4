const { Sequelize } = require('sequelize');

const database = new Sequelize('testdb', 'root', 'Tectoro@123',
    { host: 'localhost', dialect: 'mssql' });

database.sync({}).then(() => console.log("Model is synced ..."))
    .catch((err) => console.log("Error while model is syncing ...", err))

module.exports = database;