
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const {google} = require ("googleapis"); 
const OAuth2 = google.auth.OAuth2;
const dateTransformer = require('../utils/date_transformation');

module.exports = (app) => {

   //Atributes
   let flagLogin = false;
   let globalEmail;
   let firstName;
   let lastName;
   let globalConec = {};
   //Routes and connection  with views and database

   //gets
   app.get('/', (req, res) => {
      res.render('../views/main/ventanas/login/login.ejs');
   });

   app.get('/insumo', (req, res) => {

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {
               res.render('../views/main/ventanas/insumo/insumo.ejs', {
                  firstName: firstName,
                  lastName: lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
      }

   });

   app.get('/pedido', async (req, res) => {

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {
              await connection.query("SELECT * FROM producto",(err,result2)=>{
                  try {
                     if (globalConec.clienteExitoso) {
                        globalConec.clienteExitoso=false;
                        res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                           firstName:firstName,
                           lastName:lastName,
                           producto:result2,

                           alert:true,
                           alertTitle: 'Registro',
                           alertMessage: "Registro Exitoso",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           
                        });
                     }
                     else if (globalConec.pedidoExitoso) {
                        globalConec.pedidoExitoso=false;
                        res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                           firstName:firstName,
                           lastName:lastName,
                           producto:result2,

                           alert:true,
                           alertTitle: 'Pedido registrado',
                           alertMessage: "Exito",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           
                        });
                     }
                     else{
                        res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                           firstName:firstName,
                           lastName:lastName,
                           producto:result2
                        });
                     }
  
                  } catch (error) {
                     console.error(`Error del tercer try ${error}`);
                     console.error(`Error de la tercera consulta ${err}`);
                  }
               });

         } catch (error) {
            console.error(`Error del segundo try ${error}`);
            console.error(`Error del segundo query ${err}`);
            flagLogin = false;
            globalEmail = '';
            res.redirect('/');
         }
      }
   });

   app.get('/reporte', async (req, res) => {

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {
               await connection.query('SELECT * FROM cliente',(err,result)=>{
                  try {
                     res.status(200).render('../views/main/ventanas/reportes/reportes.ejs', {
                        firstName: firstName,
                        lastName: lastName,
                        cliente:result
                     });
                  } catch (error) {
                     console.error(`Error del try ${error}`);
                     console.error(`Error del query ${err}`);
                  }
               })

            } catch (error) {
               console.error(`Error del try ${error}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
      }
   });

   app.get('/usuario', (req, res) => {

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {

         if (globalConec.usuExi) {
            globalConec.usuExi =false;
            
             async function main() {
            
               const oauth2Client =  new  OAuth2 ( 
                  process.env.EM_IDUSER,process.env.EM_CLISECR, 
                  " https://developers.google.com/oauthplayground "// URL de redireccionamiento 
                  );

               oauth2Client . setCredentials ({ 
               refresh_token: process.env.EM_REFRTOK 
               }); 

                const accessToken = oauth2Client.getAccessToken ()

                let transporter = nodemailer.createTransport({
                  service: "Gmail",
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true, // true for 465, false for other ports
                  auth: {
                     type: 'OAuth2',
                     clientId: process.env.EM_IDUSER,
                     clientSecret: process.env.EM_CLISECR,
                     user: process.env.EM_USER,
                     refreshToken: process.env.EM_REFRTOK, 
                     accessToken: accessToken 
                  },
                  tls: {
                     rejectUnauthorized: false
                   }
               });
               
                let info = await transporter.sendMail({
                   from: '<naturanaLogs@gmail.com>', 
                   to: "maposada@deboraarango.edu.co, montana.lubowitz51@ethereal.email,"+globalConec.e__mail, 
                   subject: "Tu usuario y contraseña para naturana 🙂", // Subject line
                   html: `<b>NATURANA REGISTROS</b><br><p>Su usuario es : ${globalConec.usuario}<p><br><p>Su contraseña es : ${globalConec.password}`, // html body
                }, (error, response) => {
                  error ? console.log(error) : console.log(response);
                  transporter.close();
               });

               console.log("Message sent: %s", info);
               
               
               //console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
               
                // Preview only available when sending through an Ethereal account
                //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }
               
                main().catch(console.error);
                                  
                /*Nombre	Montana Lubowitz
                Nombre de usuario	montana.lubowitz51@ethereal.email (también funciona como una dirección de correo electrónico entrante real)
                Contraseña	pnwkvregz9jpfDyusS
                autorización : 4/0AX4XfWivCmTb82qPMtQdTN3bgQNu7fGa2ZdOR8WnUwsa55a5LEasDhBhEYTM0L5zrCyMPw
                actualización: 1//040QTIGcdjHhXCgYIARAAGAQSNwF-L9IraPKnkvg1gDcZtQ9Nr5hqAVhEJEJE77FdzNrQUr35SiczC3gvilJUM5_yS4PbFeJPOY8 */

                res.render('../views/main/ventanas/usuario/usuario.ejs', {
                   alert:true,
                   alertTitle: 'Registro Exitoso',
                   alertMessage: "Su usuario y contraseña se enviaran a su correo",
                   alertIcon: "success",
                   showConfirmButton: false,
                   timer: 25000,
                   firstName:firstName,
                   lastName:lastName
                 })
         }else {  
            try {
            res.render('../views/main/ventanas/usuario/usuario.ejs', {
               firstName: firstName,
               lastName: lastName
            });
         } catch (error) {
            console.error(`Error del try ${error}`);
            console.error(`Error de la consulta ${err}`);
            flagLogin = false;
            globalEmail = '';
            res.redirect('/');

         }
      }
   } 
      
   });

   app.get('/cliente', (req, res)=>{

      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else {
            try {
               res.render('../views/main/ventanas/cliente/cliente.ejs',{
                  firstName: firstName,
                  lastName: lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin=false;
               globalEmail='';
               res.redirect('/');
            }         
      }
   });

   app.get('/main' , (req , res)=>{

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {
               res.render('../views/main/main.ejs', {
                  firstName: firstName,
                  lastName: lastName
               });
            } catch (error) {
               console.error(` Error del catch ${error}`);
               console.error(` Error del query ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
      }

   });

   app.get('/despacho', (req, res) => {

      let alert = globalConec.alert;
      let idped = globalConec.idped;

      connection.query("SELECT * FROM pedido ",
      (err, results) => {
        if (err) {
           console.log(err);
        }else{

        results.map( (result) => {
         dateTransformer.resultToTable(result);
         //result.is_active == 1 ? result.is_active = "Sí" : result.is_active = "No";
       });

       console.log(results); 

         res.render('../views/main/ventanas/despacho/despacho.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert:alert,
            idped:idped
           });
           if (globalConec.alert===true) {
            globalConec.alert='undefined';
            
           }
        } 
      }) 
   
   });
 
   app.get('/borrarped', (req, res) => {

      let id = globalConec.idped;

      connection.query(
         "DELETE FROM users WHERE cedula = ?",
         [id],
         (err, results) => {
           if (err) {
             console.log(err);
           } else {
             res.redirect('/cuentaCobro');
           }
         }
       );
   })

   app.get("/generaCobro/:id", (req, res) => {
      const id = req.params.id;

      console.log(id);
      globalConec.alert=true;
      globalConec.idped = id;
      res.redirect('/despacho');

    });

   app.get('/cuentaCobro', (req, res) => {

      const id = globalConec.idped;

      console.log(id);

      connection.query('SELECT * FROM cliente LEFT JOIN pedido ON cliente.id = pedido.id_cliente LEFT JOIN cuenta_c ON pedido.id = cuenta_c.id__ped UNION SELECT * FROM cliente RIGHT JOIN pedido ON cliente.id = pedido.id_cliente RIGHT JOIN cuenta_c ON pedido.id = cuenta_c.id__ped',
      (err,results) => {
         if (err) {
            console.log(err);
         }else{
            results.map( (result) => {
               dateTransformer.resultToTable(result);
             });
            console.log(results);
           /* res.render('../views/main/ventanas/cuentaCobro/cuentaCobro.ejs',{
               cuenta_c: result
            });*/
         }
      })
   
      if (globalConec.idped !== 'undefined') {
         globalConec.idped = 'undefined';
       }

       console.log(id);
   })


   //POSTS

   //Login for users 


   app.post("/despachar/:id", (req, res) => {
      const id = req.params.id;
      const { comentario,estado } = req.body;
   
      console.log(req.body);
   
      connection.query('UPDATE pedido SET ? WHERE id =?',[{
         comentario:req.body.comentario,
         est_desp:req.body.estado
      },id],(err,result) => {
         console.log(result);
         if (err) {
            console.log(err);
         }else{
            
            res.redirect('/despacho');
         }
      })
   
    });

   app.post("/entregar/:id", (req, res) => {
      const id = req.params.id;
      const { comentario,estado } = req.body;
   
      console.log(req.body);
   
      connection.query('UPDATE pedido SET ? WHERE id =?',[{
         comentario:req.body.comentario,
         est_recep:req.body.estado
      },id],(err,result) => {
         console.log(result);
         if (err) {
            console.log(err);
         }else{
            
            res.redirect('/despacho');
         }
      })
   
    });

   app.post('/auth', async (req, res) => {
      
      const { email, password } = req.body;
      globalEmail = email; 
      if (email && password) {
         connection.query('SELECT user, firstName, lastName, pass, rol FROM users WHERE user= ?', email, async (err, results) => {
            firstName=results[0].firstName;
            lastName=results[0].lastName;
            try {
               console.log(results);
               if (results.length === 0 || !(await bcryptjs.compare(password, results[0].pass))) {
                  try {
                     res.render('../views/main/ventanas/login/login.ejs', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrecta",
                        alertIcon: "warning",
                        showConfirmButton: true,
                        timer: false,
                        ruta: '/'
                     });
                  } catch (error) {
                     console.error(error);
                  }
               } else {

                  flagLogin = true;
                  if (flagLogin === true && results[0].rol === 'Administrador') {
                     try {
                        res.render('../views/main/ventanas/login/login.ejs', {
                           alert: true,
                           alertTitle: "Inicio de session",
                           alertMessage: "Inicio de session éxitoso",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           ruta: 'main'
                        });
                     } catch (error) {
                        console.error(error);
                     }
                  } else if (flagLogin === true && results[0].rol === 'Cajero') {
                     try {
                        res.render('../views/main/ventanas/login/login.ejs', {
                           alert: true,
                           alertTitle: "Inicio de session",
                           alertMessage: "Inicio de session éxitoso",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           ruta: 'pedido'
                        });
                     } catch (error) {
                        console.error(error);
                     }
                  } else if (flagLogin === true && results[0].rol === 'Recepcionista') {
                     try {
                        res.render('../views/main/ventanas/login/login.ejs', {
                           alert: true,
                           alertTitle: "Inicio de session",
                           alertMessage: "Inicio de session éxitoso",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           ruta: 'pedido'
                        });
                     } catch (error) {
                        console.error(error);
                     }
                  } else if (flagLogin === true && results[0].rol === 'Insumo') {
                     try {
                        res.render('../views/main/ventanas/login/login.ejs', {
                           alert: true,
                           alertTitle: "Inicio de session",
                           alertMessage: "Inicio de session éxitoso",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           ruta: 'insumo'
                        });
                     } catch (error) {
                        console.error(error);
                     }
                  }
               }
               flagLogin === false;
            } catch (error) {
               console.error(`El error del try es:  : ${error}`);
               console.error(`El error de la consulta es : ${err}`);
               res.redirect('/');
            }
         });
      }
   });

   app.post('/session-out' , (req , res)=>{
      flagLogin=false;
      firstName='';
      lastName='';
      res.render('../views/main/ventanas/login/login.ejs');
   });
   
   app.post('/usu_input', async(req, res) => {
      
      const {Nombre,Apellido,Apellido2,Cedula,Cargo,Horario,P__seg,R__seg,e__mail} = req.body;

      const generaUsu = (Nombre,Apellido,Cedula) => {

         let N = Nombre.slice(0,3);
         let A = Apellido.slice(0,3);
         let C = Cedula.slice(0,3);

         let usuario = (N + A + C);
         return usuario;
     }
      const generaPass = (id,nombre,Lname,rol) => {
         let n = nombre.slice(0,3);
         let ln = Lname.slice(0,3);
         let i = id.slice(0,3);
         let r = rol.slice(0,1)

         let pass = (n+ln+r+i);

         return pass;
     }
     let usuario = await generaUsu(Nombre,Apellido,Cedula);
     let password = await generaPass(Cedula,Nombre,Apellido,Cargo);
               
     globalConec.e__mail = e__mail;
     globalConec.usuario = usuario;
     globalConec.password = password;

     try {
      connection.query('SELECT * FROM users WHERE id =?',Cedula, async (err, results) => {
         
         let encrip = await bcryptjs.hash(password, 8);

            if (err) {
               console.log('este es tu error' + err);
            }else if (results.length===0) {

               connection.query('INSERT INTO users SET ?', {
                  id: Cedula,
                  user: usuario,
                  firstName: Nombre,
                  lastName: Apellido,
                  lastName2: Apellido2,
                  rol: Cargo,
                  pass: encrip,
                  horario: Horario,
                  p_seg: P__seg,
                  r_seg: R__seg,
                  e_mail:e__mail
         
              }, (err,results)=>{
               if (err) { 
                   console.log(err);
               }else{
                  globalConec.usuExi = true;
                  res.redirect('/usuario');

                   /*res.render('../views/main/ventanas/usuario/usuario.ejs', {
                       alert:true,
                       alertTitle: 'Registro Exitoso',
                       alertMessage: "Su usuario y contraseña se enviaran a su correo",
                       alertIcon: "success",
                       showConfirmButton: false,
                       timer: 25000,
                       ruta: "usuario",
                       firstName:firstName,
                       lastName:lastName
                     });*/
                     
                  }

               });
            }else{
               
               res.render('../views/main/ventanas/usuario/usuario.ejs', {
                  alert: true,
                  alertTitle: "Error",
                  alertMessage: "ID repetido",
                  alertIcon: "warning",
                  showConfirmButton: true,
                  timer: false,
                  ruta: 'usuario',
                  firstName:firstName,
                  lastName:lastName
               });   
            }
      });
     } catch (error) {
        console.log(error);
     };


   });

   app.post('/cli_input', (req,res)=>{

      const {Nombre,Apellido,Apellido2,Cedula,Email,direccion,telefono,telefono2,F_nacimiento} = req.body;
      console.log(req.body);
      try {
         connection.query('SELECT * FROM cliente WHERE id =?', [Cedula], (err, results)=>{

            if (err) {
               console.log(err);
            }else if (results.length === 0){
               
               let sql = `INSERT INTO cliente SET ?`;

               connection.query(sql,{
                  id:Cedula,
                  email:Email,
                  nombre:Nombre,
                  apellido:Apellido,
                  apellido2:Apellido2,
                  F_nacimiento:F_nacimiento,
                  direccion:direccion,
                  telefono1:telefono,
                  telefono2:telefono2}

                  ,async(err1,results1)=>{
               if (err1) {
                   console.log(err1);
               }else{
                  globalConec.clienteExitoso = true;
                  res.redirect('/pedido');
                  console.log(results1);
                }
               })
            }
            else{
               
               res.render('../views/main/ventanas/pedido/pedido.ejs', {
                  alert: true,
                  alertTitle: "Error",
                  alertMessage: "ID repetido",
                  alertIcon: "warning",
                  showConfirmButton: true,
                  timer: false,
                  ruta: 'pedido',
                  firstName:firstName,
                  lastName:lastName
               });   
            }
         })
      } catch (error) {
         console.log(err);
      }
      
   });

   


}
