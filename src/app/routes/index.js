
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
   let globalConec = {
      statusCc:'sin status',
      idped:'undefined',
      alert:'undefined',
      alert1:'undefined',
      alert2: 'undefined',
      insuComf: comf = [1],
      numInsu: num=0,
      prodComf: comf = [1],
      numProd: num = 0
   };
   //Routes and connection  with views and database

   //gets
   app.get('/', (req, res) => {
      res.render('../views/main/ventanas/login/login.ejs');
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
                   cc: '<naturanaLogs@gmail.com>',
                   to: globalConec.e__mail, 
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

   app.get('/insumo', (req, res) => {

      let numInsu = globalConec.numInsu;
      let insuComf = globalConec.insuComf;
      let alert = globalConec.alert;
      let alert1 = globalConec.alert1;
      let alert2 = globalConec.alert2;

      console.log(numInsu);
      console.log(insuComf);

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {

               connection.query('SELECT * FROM insumos', (err1,result1) => {
                  //console.log(result1);
                  if (err1) {
                     console.log(err1);
                  }else{

                     connection.query('SELECT * FROM producto',(err2,result2) =>{
                        if (err2) {
                           console.log(err2)
                        }else{
                           
                           res.render('../views/main/ventanas/insumo/insumo.ejs', {
                              firstName: firstName,
                              lastName: lastName,
                              bodega:result1,
                              tienda:result2,
                              insuComf:insuComf,
                              alert:alert,
                              alert1:alert1,
                              alert2:alert2,
                              alertTitle: 'Registro Exitoso',
                              alertMessage: "Su usuario y contraseña se enviaran a su correo",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer: 25000

                           });
                           
                        }
                     })

                  }
               })

            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
         }

   });

   app.get('/insertInsumo', (req,res) => {
   
      globalConec.numInsu = globalConec.numInsu + 1;
   
      globalConec.insuComf.push(1);
      res.redirect('/insumo');
   })

   app.get('/pedido', async (req, res) => {

      let numProd = globalConec.numProd;
      let prodComf = globalConec.prodComf;
 

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
                           prodComf:prodComf,
                           numProd:numProd,
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
                           prodComf:prodComf,
                           numProd:numProd,
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
                           producto:result2,
                           prodComf:prodComf,
                           numProd:numProd
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

   app.get('/insertProducto', (req,res) => {
      globalConec.numProd = globalConec.numProd + 1;

      globalConec.prodComf.push(1);
      res.redirect('/pedido');
   });

   app.get('/despacho', (req, res) => {

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

       console.log(globalConec.statusCc); 

       if (globalConec.statusCc==='sin status') {
          if (globalConec.alert) {
              console.log(globalConec.alert);
            globalConec.alert="undefined";
            res.render('../views/main/ventanas/despacho/despacho.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert:true,
            idped:idped,
            ruta: 'cuentaCobro',
            status:globalConec.statusCC
           });
          }else{
             res.render('../views/main/ventanas/despacho/despacho.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert:'undefined',
            idped:idped,
            ruta: 'cuentaCobro'
           });
          }

       }else if (globalConec.statusCc==='rechazo') {
          globalConec.statusCc = "sin status";
         res.render('../views/main/ventanas/despacho/despacho.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert1:true,
            idped:idped,
            ruta: 'despacho',
            status:globalConec.statusCC
           });
         }
 
       } 

      }) 

   });

   app.get("/generaCobro/:id", (req, res) => {
      const id = req.params.id;

      console.log(id);
      globalConec.alert=true;
      globalConec.idped = id;
      res.redirect('/despacho');

   });

   app.get('/cuentaCobro', (req, res) => {

      res.render('../views/main/ventanas/cuentaCobro/cuentaCobro.ejs');
      /*
   const id = globalConec.idped;

   console.log(id);

   connection.query('SELECT * FROM cuenta_c WHERE id__ped = ?',[id],
   (err,result1) => {
      if (err) {
         console.log(err);
      }else if (result1.length===0) {
         console.log(result1);
         connection.query('INSERT INTO cuenta_c SET ?',{
            id__ped:id
         },(err,result2) => {
            if (err) {
               console.log(err);
            }else{
               connection.query('SELECT * FROM cliente LEFT JOIN pedido ON cliente.id = pedido.id_cliente LEFT JOIN cuenta_c ON pedido.id = cuenta_c.id__ped WHERE pedido.id = ? UNION SELECT * FROM cliente RIGHT JOIN pedido ON cliente.id = pedido.id_cliente RIGHT JOIN cuenta_c ON pedido.id = cuenta_c.id__ped WHERE pedido.id = ?',
               [id,id]
               ,(err,result3) => {
                  if (err) {
                     console.log(err);
                  }else{
                     result3.map( (result) => {
                        dateTransformer.resultToTable(result);
                      });
                     console.log(result3[0]);
                    res.render('../views/main/ventanas/cuentaCobro/cuentaCobro.ejs',{
                        cuenta_c: result3[0]
                     });
                  }
               })
            }
         })
      }else{
         globalConec.statusCc = 'rechazo';
         res.redirect('/despacho');
      }
   })
   
   if (globalConec.idped !== 'undefined') {
      globalConec.idped = 'undefined';
    }

    //console.log(id);*/
   });

   app.get('/reporte', async (req, res) => {

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {
               await connection.query('SELECT * FROM pedido LEFT JOIN cliente ON pedido.id_cliente = cliente.id LEFT JOIN produc_gasto ON pedido.referencia = produc_gasto.id_ped UNION SELECT * FROM pedido RIGHT JOIN cliente ON pedido.id_cliente = cliente.id RIGHT JOIN produc_gasto ON pedido.referencia = produc_gasto.id_ped'
               ,(err,result)=>{
                  try {

                     result.map( (result) => {
                        dateTransformer.resultToTable(result);
                        //result.is_active == 1 ? result.is_active = "Sí" : result.is_active = "No";
                      });

                     console.log(result[0]);

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

   app.get('/listaCc',(req,res) => {

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

       console.log(globalConec.statusCc); 

       if (globalConec.statusCc==='sin status') {

          if (globalConec.alert) {

            console.log(globalConec.alert);

            globalConec.alert="undefined";

            res.render('../views/main/ventanas/listaCc/listaCc.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert:true,
            idped:idped,
            ruta: 'cuentaCobro',
            status:globalConec.statusCC

           });
          }else{

             res.render('../views/main/ventanas/listaCc/listaCc.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert:'undefined',
            idped:idped,
            ruta: 'cuentaCobro'
           });
          }

       }else if (globalConec.statusCc==='rechazo') {
          globalConec.statusCc = "sin status";

         res.render('../views/main/ventanas/listaCc/listaCc.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            alert1:true,
            idped:idped,
            ruta: 'despacho',
            status:globalConec.statusCC
           });

         }
 
       } 

      })
   });

   //POSTS

   //Login for users 
   
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

      let numProd = globalConec.numProd;
      let prodComf = globalConec.prodComf;

      
      const {Nombre,Apellido,Apellido2,Cedula,Email,direccion,ciudad,telefono,telefono2,F_nacimiento} = req.body;
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
                  ciudad:ciudad,
                  telefono1:telefono,
                  telefono2:telefono2
               },async(err1,results1)=>{
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
               res.redirect('/pedido');
              /* res.render('../views/main/ventanas/pedido/pedido.ejs', {
                  alert: true,
                  alertTitle: "Error",
                  alertMessage: "ID repetido",
                  alertIcon: "warning",
                  showConfirmButton: true,
                  timer: false,
                  ruta: 'pedido',
                  prodComf:prodComf,
                  numProd:numProd,
                  firstName:firstName,
                  lastName:lastName
               });   */
            }
         })
      } catch (error) {
         console.log(err);
      }
      
   });
   
   app.post("/despachar/:id", (req, res) => {
      const id = req.params.id;
      const { comentario,estado } = req.body;
   
      console.log(req.body);
   
      connection.query('UPDATE pedido SET ? WHERE referencia =?',[{
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
   
      connection.query('UPDATE pedido SET ? WHERE referencia =?',[{
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

    app.post("/inventario", (req,res) => {

      const {selec_inv,referencia,producto,cantidad,valor,descripcion,ref_insu_pro,cant_insu_pro} = req.body;

      let cantI = ref_insu_pro.length;

      //console.log(selec_inv);
      //console.log(cantI);
      //console.log(cant_insu_pro);
      //console.log(valor);

      if (selec_inv==='2') {
         
         connection.query('SELECT * FROM insumos WHERE id =?',referencia, async (err, result) => {

            if (err) {
               console.log(err);
            }
            else if (result.length===0) {
               connection.query('INSERT INTO insumos SET ?',{

                  id:referencia,
                  nombre:producto,
                  cantidad_insu:cantidad,
                  valor_unit:valor,
                  descripcion:descripcion
         
            },(err,result) => {
               if (err) {
                  console.log(err);
               }else{
                  console.log(result);
                  globalConec.alert = true;
                  res.redirect('/insumo');
               }
            })
            }else{
               globalConec.alert1 = true;
               res.redirect('/insumo');
               //aviso id repetido
            }

      })

      }else if (selec_inv==='1') {
         
         connection.query('SELECT * FROM producto WHERE id =?', referencia, async (err,result) => {
            if (err) {
               console.log(err);
            }else if (result.length===0){
               connection.query('INSERT INTO producto SET ?',{

                  id:referencia,
                  nombre:producto,
                  cantidad_Tien:cantidad,
                  valor_unit:valor,
                  descripcion:descripcion,
                  cantidad_ins_consum:cantI
         
            },(err1,result1) => {
               if (err1) {
                  console.log(err1);
               }else{
         
                  for (let i = 0; i < ref_insu_pro.length; i++) {
                     
                     connection.query('INSERT INTO insu_gasto SET ?',{
                        cantidad:cant_insu_pro[i],
                        id_insum:ref_insu_pro[i],
                        id_prod:referencia
            
                     },(err2,result2) => {
                        if (err2) {
                           console.log(err2);
                        }else{
                           console.log(result2);
                        }
                     })
                  }
                  
                  res.redirect('/insumo');
               }
            })
            }else{
               //aviso id repetido
               globalConec.alert1 = true;
               res.redirect('/insumo');
            }
         })


      }else{
         //aviso escoja un inventario
      globalConec.alert2 = true;
         res.redirect('/insumo');

      }
      
   });

   app.post("/pedido", (req,res) => {

      const {idCli__ped,ciuCobro__ped,pago__ped,referencia,fechIng__ped,fechEnt__ped,ref_pro_ped,cant_pro_ped} = req.body;
      
      let cantP = ref_pro_ped.length;
      let numProd = globalConec.numProd;
      let prodComf = globalConec.prodComf;

      connection.query('SELECT * FROM pedido WHERE referencia = ?', [referencia],
      (err1,result1) => {
         if (err1) {
            console.log(err1);
         }else if (result1.length===0) {
            connection.query('INSERT INTO pedido SET ?',{
               id_cliente:idCli__ped,
               form_pago:pago__ped,
               ciudadCob:ciuCobro__ped,
               fech_ingr:fechIng__ped,
               fech_entr:fechEnt__ped,
               referencia:referencia,
               cant_pro:cantP
            },(err2,result2) => {
               if (err2) {
                  console.log(err2);
               }else{
                  
                  for (let i = 0; i < ref_pro_ped.length; i++) {
                           
                     connection.query('INSERT INTO produc_gasto SET ?',{
                        cantidad:cant_pro_ped[i],
                        id_ped: referencia,
                        id_prod:ref_pro_ped[i]
            
                     },(err3,result3) => {
                        if (err3) {
                           console.log(err3);
                        }else{
                           console.log(result3);
                        }
                     })
                  }
                  
                  res.redirect('/pedido');
               }
            })  
         }else{
            //aviso ref pedido repetido
            globalConec.alert1 = true;
            res.redirect('/pedido');
         }
         
      })
   
   });


};