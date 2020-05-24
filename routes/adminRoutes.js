const express = require('express');
const adminController = require('../controller/adminController');
const studentController = require('../controller/studentController');
const ncController = require('../controller/ncController');
const assessmentCentersController = require('../controller/assessmentCentersController');
const certificatesController = require('../controller/certificatesController');
const { check } = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/dashboard', isAuth, adminController.getDashboard);

router.get('/certificate-holder', isAuth, certificatesController.getCertificate);
router.get('/add-certificate-holder', isAuth, certificatesController.getAddCertificate);
router.post('/certificate-holder-add', isAuth, certificatesController.postCertificate);

// Student Input
router.get('/students', isAuth, studentController.getStudents);
router.get('/add-student', isAuth, studentController.getAddStudent);
router.post('/students-add', isAuth,studentController.postStudent);


router.get('/users-profile', isAuth, adminController.getUsers)
router.post('/users-add', isAuth,
    [ 
    check('email')
    .isEmail()
    .withMessage('Please enter valid email')
    .custom((value, {req}) => {
        if(value === 'test@test.com'){
            throw new Error('This email is forbiden');
        }
            return true;
    }),
    check('username', 'Enter username').not().isEmpty(),
    check('firstName', 'Enter First Name').not().isEmpty(),
    check('lastName', 'Enter Last Name').not().isEmpty(),
    check('password','Enter password with 5 or more characters').isLength({min: 5}).isAlphanumeric()],
    adminController.postUsers);

router.get('/AssessmentCenters', isAuth, assessmentCentersController.getAssessmentCenters);
router.get('/add-AssessmentCenters', isAuth, assessmentCentersController.getAddAssessmentCenters);
router.post('/AssessmentCenters-add', isAuth, assessmentCentersController.postAssessmentCenters);

router.get('/nc', isAuth, ncController.getNc);
router.get('/add-nc', isAuth, ncController.getAddNc);
router.post('/nc-add', isAuth, ncController.postNc);

router.get('/reports', isAuth, adminController.getReports);
router.post('/logout', isAuth, adminController.postLogout);

module.exports = router;