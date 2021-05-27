const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const session = require('express-session');

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
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

module.exports = app;