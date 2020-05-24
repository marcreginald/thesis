const User = require('../model/userModel'); 
const assessmentCentersModel = require('../model/assessmentCentersModel');
const { validationResult } = require('express-validator/check');
const { Op } = require("sequelize");

exports.getAssessmentCenters = async(req, res, next) => {
   
    try {
        const users =  await User.findOne({
              attributes: [
                  'firstName', 
                  'lastName', 
                  'email',
          ]})
          const assessmentCenters = await assessmentCentersModel.findAll({
              attributes: [
                'centerName',
                'region',
                'province',
                'address'
          ]})
          res.render('admin/assessmentCenters', {
          user:users,
          assessmentCenter: assessmentCenters,
          title: 'TESDA ACCREDITED ASSESSMENT CENTERS',
          path: '/AssessmentCenters',
          active: {schools:true}
        });
      } catch (error) {
          console.log(error);
      }
};

exports.getAddAssessmentCenters = (req, res, next) => {
    User.findOne({
        attributes: [
            'id',
            'firstName', 
            'lastName', 
            'username', 
            'email',
            'isAdmin',
    ]}).then(users => {
        res.render('admin/add-assessmentCenters', 
        {
            user:users,
            title: 'ADD TESDA ACCREDITED ASSESSMENT CENTERS',
            path: '/add-AssessmentCenters',
            active: {schools:true}
        })
        // console.log("All users:", JSON.stringify(users, null, 4));
        
      });
};

exports.postAssessmentCenters = async(req, res, next) => {
    const errors = validationResult(req);
    let {
        centerName, 
        region, 
        province, 
        address,
    } = req.body;

    try {
        const assessmentCenters = await assessmentCentersModel.findAll({
            attributes: [
                'centerName',
                'region',
                'province',
                'address'
        ]})
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(422).render('admin/add-assessmentCenters', 
            {
                assessmentCenter:assessmentCenters,
                title: 'Add Student',
                path: '/add-AssessmentCenters',
                errorMessage: errors.array()[0].msg,
                active: {schools:true},
                oldInput: {centerName: centerName, region: region, province: province, address: address}
            });
        }
       
        assessmentCentersModel.create(
            {   centerName,
                region,
                province,
                address
            });
        res.redirect('/AssessmentCenters'); 

    } catch (err) {
        console.log(err);
    }
};