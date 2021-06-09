
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');

module.exports = app =>{

   //Atributes
   let flagLogin= false;
   let globalEmail;
   
    //Routes and connection  with views and database

    //gets
   app.get('/' , (req , res)=>{
       res.render('../views/main/ventanas/login/login.ejs');
   });

   app.get('/insumo' , (req , res)=>{
      let cont=0;
      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         connection.query("SELECT firstName, lastName FROM insumo WHERE rol='ejemplo' AND user = ?",globalEmail,(err,result)=>{
            try {
               res.render('../views/main/ventanas/insumo/insumo.ejs',{
                  name:result[0].firstName,
                  lastName:result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin=false;
               globalEmail='';
               res.redirect('/');
            }
         });
         
      }else if(cont!==0){
         flagLogin=false;
         globalEmail='';
         res.redirect('/');
      }
      
   });

   app.get('/pedido' , (req , res)=>{
      let cont=0;
      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         connection.query("SELECT firstName, lastName FROM users WHERE rol='Recepcionista' OR rol='Administrador' AND user= ?",globalEmail,(err, result)=>{
            try {
               res.render('../views/main/ventanas/pedido/pedido.ejs',{
                  name:result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error del query ${err}`);
               flagLogin=false;
               globalEmail='';
               res.redirect('/');
            }
         });
         
      }else if(cont!==0){
         flagLogin=false;
         globalEmail='';
         res.redirect('/');
      }

   });
   
   app.get('/producto' , (req , res)=>{

      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         connection.query("SELECT firstName, lastName FROM users WHERE rol='ejemplo' AND user= ?",globalEmail,(err, result)=>{
            try {
               res.render('../views/main/ventanas/producto/producto.ejs',{
                  name:result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error del query ${err}`);
               flagLogin=false;
               globalEmail='';
               res.redirect('/');
            }
         });
         
      }else if(cont!==0){
         flagLogin=false;
         globalEmail='';
         res.redirect('/');
      }
   });

   app.get('/usuario' , (req , res)=>{
      let cont=0;
      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         connection.query("SELECT firstName, lastName, rol FROM users WHERE rol='Administrador' AND user =?",globalEmail,(err, result)=>{
            try {
               res.render('../views/main/ventanas/usuario/usuario.ejs',{
                  name:result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin=false;
               globalEmail='';
               res.redirect('/');
               
            }
         });
         
      }else if(cont!==0){
         res.redirect('/');
         globalEmail='';
      }
   });

   app.get('/main' , (req , res)=>{
      
      let cont=0;

      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         connection.query("SELECT firstName, lastName FROM users WHERE rol = 'Administrador' AND user= ?",globalEmail,(err,result)=>{
            try {
               res.render('../views/main/main.ejs',{
                  name:result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(` Error del catch ${error}`);
               console.error(` Error del query ${err}`);
               flagLogin=false;
               globalEmail='';
               res.redirect('/');
            }
            //Here
            cont++;
         });
         console.log(cont);
         //Ask to Jairo
      }else if(cont!==0){
         globalEmail='';
         res.redirect('/');
         
      }
      
   });





   //posts
    //Login for users 
    app.post('/auth' , async(req , res)=>{

        const {email, password}  = req.body;
         globalEmail=email;  
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
                           ruta:'/'
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

     app.post('/session-out' , (req , res)=>{
      flagLogin=false;
      res.render('../views/main/ventanas/login/login.ejs');
   });
   
}