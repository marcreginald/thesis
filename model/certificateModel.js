const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const assessmentCentersModel = require('../model/assessmentCentersModel');
const studentModel = require('../model/studentModel');
const specializationModel = require('../model/ncModel');

const certificateModel = sequelize.define('certificates', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    certificateHolderName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    centerName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    specialization: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    issuedDate:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    expiryDate:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    certificateType: {
        type: Sequelize.ENUM,
        values: ['NC-I', 'NC-II', 'NC-III', 'NC-IV', 'COC'],
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true
    },

});


module.exports = certificateModel;