const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Batch00s.218@localhost:5432/workout-log");

module.exports = sequelize;