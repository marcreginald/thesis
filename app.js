const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const expressHbs = require('express-handlebars');
const _handlebars = require('handlebars');
const session = require('express-session');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const app = express();

// models
const assessmentCenter = require('./model/assessmentCentersModel');
const certificate = require('./model/certificateModel');
const nc = require('./model/ncModel');
const student = require('./model/studentModel');

const sequelize = require('./config/database');
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.engine('hbs', expressHbs({defaultLayout: 'default', extname: 'hbs', handlebars: allowInsecurePrototypeAccess(_handlebars)}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var sessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 60 * 60 * 1000,
    expiration: 7 * 24 * 60 * 60 * 1000
 });

app.use(session({
    key: 'session_cookie_name',
    secret: 'Secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Routes
app.use('/', defaultRoutes);
app.use(adminRoutes); 

assessmentCenter.hasMany(student);
nc.hasMany(student);
student.belongsTo(nc);
student.belongsTo(assessmentCenter);
assessmentCenter.hasMany(nc);
nc.belongsTo(assessmentCenter);

const server = http.createServer(app);

sessionStore.sync()
sequelize.sync({force: false})
.then(
    result => {
        // console.log(result);
        server.listen(3000);
    })
.catch(
        err => {
            console.log(err);
    });

