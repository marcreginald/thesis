const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const studentModel = require('../model/studentModel');
const certificateModel = require('../model/certificateModel');
const assessmentCentersModel = sequelize.define('assessment_centers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    centerName: {
        type: Sequelize.STRING,
        allowNull: false
    },
   
    region : {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['Region XIII - CARAGA'],
    },
    province: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'],
    },
    address : {
    type: Sequelize.STRING,
    allowNull: false
    }

});

module.exports = assessmentCentersModel;