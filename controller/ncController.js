const User = require('../model/userModel'); 
const studentModel = require('../model/studentModel');
const ncModel = require('../model/ncModel');
const certificateModel = require('../model/certificateModel');
const assessmentCentersModel = require('../model/assessmentCentersModel');
const { validationResult } = require('express-validator/check');
const { Op } = require("sequelize");

exports.getNc = async(req, res, next) => {

    try {
        const users = await User.findOne({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})

        const specializations = await ncModel.findAll({
            attributes: [
                'id',
                'specializationName',
                'centerName',
                'specializationType'
            ]
        })
            res.render('admin/nc', 
            {
                user:users,
                nc:specializations,
                title: 'Courses & Trainings',
                path: '/nc',
                active: {nc:true}
            })
    } catch (error) {
        console.log(error);
    }
};

exports.getAddNc = async(req, res, next) => {

    try {
      const users =  await User.findOne({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})

        const aCenters = await assessmentCentersModel.findAll({
            attributes: [
                'id',
                'centerName'
            ]
        })
        const students = await studentModel.findAll({
            attributes: [
                'id'
            ]
        })
        const certificate = await certificateModel.findAll({
            attributes: [
                'id'
            ]
        })

        res.render('admin/add-nc', 
        {
            user:users,
            aCenter: aCenters,
            certificates:  certificate,
            student: students,
            title: 'Add Courses & Trainings',
            path: '/add-nc',
            active: {nc:true}
        })
    } catch (error) {
        console.log(error);
    }
};

exports.postNc = async(req, res, next) => {

    const errors = validationResult(req);
    let {
        centerName, 
        specializationName, 
        specializationType,
    } = req.body;

    try {

        const users =  await User.findOne({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})

        const certificate = await certificateModel.findAll({
            attributes: [
                'id'
            ]
        })

        const students = await studentModel.findAll({
            attributes: [
                'id'
            ]
        })

        const aCenters = await assessmentCentersModel.findAll({
            attributes: [
                'id',
                'centerName',     
        ]})
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(422).render('admin/add-nc', 
            {
                user:users,
                aCenter: aCenters.toString(),
                certificates:  certificate.toString(),
                student: students.toString(),
                title: 'Add Courses & Trainings',
                path: '/add-nc',
                active: {nc:true},
                errorMessage: errors.array()[0].msg,
                oldInput: {centerName: centerName, specializationName: specializationName, specializationType:specializationType}
            });
        }
       
        ncModel.create(
            {   centerName,
                specializationName,
                specializationType,
            });
        res.redirect('/nc'); 

    } catch (err) {
        console.log(err);
    }

};