const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

const app = express();

//Ports
app.set('port', process.env.PORT || 4000);

//Theme
app.set('view engine', 'ejs');

//Routes views
app.set('views', path.join(__dirname,'../app/views'));

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Envairoment
dotenv.config({path: path.join(__dirname,'../env/.env')});

//css
app.use('/resource', express.static(path.join(__dirname,'../public')));


//Cookis
// app.set('trust proxy', 1);

// app.use(session({
//     cookie: {
//         secure: true,
//         maxAge: 60000
//     },
//     store: new MongoStore(),
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: false
// }));

// app.use(function (req, res, next) {
//     if (!req.session) {
//         return next(new Error('Error inesperado')) //handle error
//     }
//     next() //otherwise continue
// });

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

module.exports = app;