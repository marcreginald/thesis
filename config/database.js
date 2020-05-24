const Sequelize = require('sequelize');
// const db = {};
const sequelize = new Sequelize('tesda_thesis_db', 'root', 'toor', {
    host: 'localhost',
    dialect: 'mysql',
    /* one of '' | 'mariadb' | 'postgres' | 'mssql' */
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
  });
  
  // db.sequelize = sequelize;
  // db.Sequelize = Sequelize;
  
module.exports = sequelize;