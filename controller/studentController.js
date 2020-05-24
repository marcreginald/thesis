const studentModel = require('../model/studentModel');
const User = require('../model/userModel'); 
const assessmentCentersModel = require('../model/assessmentCentersModel');
const specializationModel = require('../model/ncModel');
const { validationResult } = require('express-validator/check');

exports.getStudents = async(req, res, next) => {
    
    try {
      const users =  await User.findOne({
            attributes: [
                'firstName', 
                'lastName', 
                'email',
        ]})

        const students = await studentModel.findAll({
            attributes: [
                'firstName', 
                'middleName', 
                'lastName', 
                'email',
                'birthDate',
                'gender',
                'address',
                'school',
                'nc',
                'status'
        ]})
     
        res.render('admin/students',{
                user:users,
                student:students,
                path: '/students',
                title: 'Student Overview',
                active:{students: true} 
            });
            // console.log("All users:", JSON.stringify(users, null, 4));
    
    
    } catch (error) {
        console.log(error);
    }
    
};



exports.getAddStudent = async(req, res, next) => {

try {
    const users = await User.findOne({
        attributes: [
            'firstName', 
            'lastName', 
            'email',
    ]})

    const aCenters = await assessmentCentersModel.findAll({
        attributes: [
            'id',
            'centerName'
        ]
    })

    const aCert = await specializationModel.findAll({
        attributes: [
            'id',
            'specializationName'
        ]
    })

    res.render('admin/add-student',{
        user:users,
        aCenter: aCenters,
        specializtion: aCert,
        path: '/add-student',
        title: 'Add Student',
        active:{students: true} 
    });

} catch (error) {
    console.log(error);
}
      
      
};

exports.postStudent = async(req, res, next) => {
    const errors = validationResult(req);
    let {
        firstName, 
        middleName, 
        lastName, 
        email,
        birthDate,
        gender,
        address,
        school,
        nc,
        status,
        assessmentCenterId,
        specializationId
    } = req.body;

    try {
        const unEmail = await studentModel.findOne({where: {email: email}})
        
        const students = await studentModel.findAll({
            attributes: [
                'firstName', 
                'middleName', 
                'lastName', 
                'email',
                'birthDate',
                'gender',
                'address',
                'school',
                'nc',
                'status'
        ]})
            if(!errors.isEmpty()){
                console.log(errors.array());
                return res.status(422).render('admin/add-student', 
                {
                    student:students,
                    assId: assessmentId,
                    title: 'Add Student',
                    path: '/add-student',
                    errorMessage: errors.array()[0].msg,
                    active: {students:true},
                    oldInput: {email: email, gender: gender, address: address, school: school, birthDate: birthDate, firstName: firstName, middleName: middleName, lastName: lastName, status: status}
                });
            }
            if(!unEmail){

                    studentModel.create(
                        {   
                            firstName,
                            lastName,
                            middleName,
                            gender,
                            birthDate,
                            school,
                            nc,
                            address, 
                            email,
                            status,
                            assessmentCenterId,
                            specializationId
                            })
                        res.redirect('/students'); 
    
            }
                return res.redirect('/add-student')

    } catch (err) {
        console.log(err);
    }

};