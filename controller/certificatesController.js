const User = require('../model/userModel'); 
const studentModel = require('../model/studentModel');
const certificateModel = require('../model/certificateModel');
const assessmentCentersModel = require('../model/assessmentCentersModel');
const ncModel = require('../model/ncModel');
const { validationResult } = require('express-validator/check');

exports.getCertificate = async(req, res, next) => {

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


        const certificateHolders = await certificateModel.findAll({
            attributes: [
                'id',
                'certificateHolderName',
                'certificateType',
                'specialization',
                'centerName',
                'issuedDate',
                'expiryDate',
                'status'
            ]
        })

    res.render('admin/certificates', 
    {
        user:users,
        certificateHolder: certificateHolders,
        path: '/certificate-holder',
        title: 'Certificate Holder',
        active:{certificates: true} 
    });
} catch (error) {
    console.log(error);
}
  
};

exports.getAddCertificate = async(req, res, next) => {

    try{
        const users = await User.findOne({
        attributes: [
            'id',
            'firstName', 
            'lastName', 
            'username', 
            'email',
            'isAdmin',
        ]})

        const students = await studentModel.findAll({
            attributes: [
                'id',
                'firstName', 
                'middleName', 
                'lastName', 
                'email',
                'birthDate',
                'gender',
                'address',
                'school',
                'nc',
            ]
        })

        res.render('admin/add-certificate', 
        {
            user: users,
            student: students,
            path: '/add-certificate-holder',
            title: 'Add Certificate Holder',
            active:{certificates: true} 
        });
    }catch(error){
        console.log(error);
    }

 
};

exports.postCertificate = async(req, res, next) => {
    const errors = validationResult(req);
    let {
        certificateHolderName,
        specialization, 
        centerName,
        certificateType,
        issuedDate,
        expiryDate,
        status,
    } = req.body;

    try {

       
        const certificateHolders = await certificateModel.findAll({
            attributes: [
                'id',
                'certificateHolderName', 
                'specialization',
                'certificateType',
                'centerName',
                'issuedDate',
                'expiryDate',
                'status'
               
        ]})
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(422).render('admin/add-certificate',  
            {
                certificateHolder:certificateHolders,
                path: '/add-certificate-holder',
                title: 'Add Certificate Holder',
                active:{certificates: true},
                errorMessage: errors.array()[0].msg,
                oldInput: {certificateHolderName: certificateHolderName, 
                    centerName: centerName,
                    issuedDate: issuedDate,
                    expiryDate: expiryDate,
                    }
            });
        }
        const assessmentCenterId = await assessmentCentersModel.findAll({
            attributes: [
                'id',
            ]
        })
     
            certificateModel.create(
                {                 
                    certificateHolderName, 
                    specialization,
                    certificateType,
                    centerName,
                    issuedDate,
                    expiryDate,
                    status,
                    assessmentCenterId
                });
            res.redirect('/certificate-holder'); 
       
   }catch(error){
       console.log(error);
   }
};
