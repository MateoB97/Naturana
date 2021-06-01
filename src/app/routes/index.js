
const app = require('../../config/server');

module.exports = app =>{

    //Routes and connection  with views and database

    //Example
    app.get('/' , (req , res)=>{
       res.send('hello from simple server :)')
    })

    app.get('/login' , (req , res)=>{
        res.render('../views/user/login.ejs')
     });

     
}