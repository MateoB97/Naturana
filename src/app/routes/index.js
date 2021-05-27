
const app = require('../../config/server');

module.exports = app =>{

    //Routes and connection  with views and database

    //Example
    app.get('/' , (req , res)=>{
       res.send('hello from simple server :)')
    })

}