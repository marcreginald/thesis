const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const assessmentCentersModel = require('../model/assessmentCentersModel');
const studentModel = require('../model/studentModel');
const certificateModel = require('../model/certificateModel');

const specializationModel = sequelize.define('specializations', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    centerName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: assessmentCentersModel.centerName
    },
    specializationName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    specializationType: {
        type: Sequelize.ENUM,
        values: ['NC-I', 'NC-II', 'NC-III', 'NC-IV', 'COC'],
        allowNull: false
    },


});


module.exports = specializationModel;