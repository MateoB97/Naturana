
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');

module.exports = app =>{

   
    //Routes and connection  with views and database

    //gets
   app.get('/login' , (req , res)=>{
       res.render('../views/main/ventanas/login/login.ejs')
   });

   app.get('/insumo' , (req , res)=>{
      res.render('../views/main/ventanas/insumo/insumo.ejs')
   });

   app.get('/pedido' , (req , res)=>{
      res.render('../views/main/ventanas/pedido/pedido.ejs')
   });
   app.get('/producto' , (req , res)=>{
      res.render('../views/main/ventanas/producto/producto.ejs')
   });

   app.get('/usuario' , (req , res)=>{
      res.render('../views/main/ventanas/usuario/usuario.ejs')
   });

   app.get('/main' , (req , res)=>{
      res.render('../views/main/main.ejs')
   });

   //posts

    //Login for users 
    app.post('/auth' , async(req , res)=>{
        const {email, password}  = req.body;
        let flagLogin= false;

         if (email && password) {
            connection.query('SELECT user, pass, rol FROM users WHERE user= ?', email, async(err,results)=>{
               try {
                  if (results.length===0 || !(await bcryptjs.compare(password, results[0].pass) )) {
                     try {
                        res.render('../views/main/ventanas/login/login.ejs',{
                           alert:true,
                           alertTitle: "Error",
                           alertMessage: "Usuario y/o contraseña incorrecta",
                           alertIcon: "warning",
                           showConfirmButton: true,
                           timer:false,
                           ruta:'login'
                       });
                     } catch (error) {
                        console.error(error);
                     }
                  }else{
                     flagLogin=true;
                     if (flagLogin===true && results[0].rol==='Administrador') {
                        try {
                           res.render('../views/main/ventanas/login/login.ejs',{
                              alert:true,
                              alertTitle: "Inicio de session",
                              alertMessage: "Inicio de session éxitoso",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer:1500,
                              ruta:'main'
                          });
                        } catch (error) {
                           console.error(error);
                        }
                     }else if (flagLogin===true && results[0].rol==='Cajero') {
                        try {
                           res.render('../views/main/ventanas/login/login.ejs',{
                              alert:true,
                              alertTitle: "Inicio de session",
                              alertMessage: "Inicio de session éxitoso",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer:1500,
                              ruta:'main'
                          });
                        } catch (error) {
                           console.error(error);
                        }
                     }else if (flagLogin===true && results[0].rol==='Recepcionista') {
                        try {
                           res.render('../views/main/ventanas/login/login.ejs',{
                              alert:true,
                              alertTitle: "Inicio de session",
                              alertMessage: "Inicio de session éxitoso",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer:1500,
                              ruta:'pedido'
                          });
                        } catch (error) {
                           console.error(error);
                        }
                     }else if (flagLogin===true && results[0].rol==='Insumo') {
                        try {
                           res.render('../views/main/ventanas/login/login.ejs',{
                              alert:true,
                              alertTitle: "Inicio de session",
                              alertMessage: "Inicio de session éxitoso",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer:1500,
                              ruta:'insumo'
                          });
                        } catch (error) {
                           console.error(error);
                        }
                     }
                  }
                  flagLogin===false;
               } catch (error) {
                  console.error(`El error del try es:  : ${error}`);
                  console.error(`El error de la consulta es : ${err}`);
               }
            });
         }
     });

   
}