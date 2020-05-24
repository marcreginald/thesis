const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const userModel = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.ENUM,
        values: ['Admin', 'User'],
        allowNull: false
    },
    resetToken: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    resetTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true
    }

});

module.exports = userModel;