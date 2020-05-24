const Sequelize = require('sequelize');

const sequelize = require('../config/database');
const specializationModel = require('../model/ncModel');
const certificateModel = require('../model/certificateModel');
const assessmentCentersModel = require('../model/assessmentCentersModel');

const studentModel = sequelize.define('student_profiles', {
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
    middleName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
   birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
   },
   gender : {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['Male', 'Female'],
    },
    address : {
    type: Sequelize.STRING,
    allowNull: false
    },
    school : {
    type: Sequelize.STRING,
    allowNull: false
    },
    nc : {
    type: Sequelize.STRING,
    allowNull: false
    },
    status: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['Passed', 'Dropped'],
    }
    
});


module.exports = studentModel;