
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const {google} = require ("googleapis"); 
const OAuth2 = google.auth.OAuth2;


//UTILS
const dateTransformer = require('../utils/date_transformation');
const enteros = require('../utils/tansformacion_enteros');
const gasto = require('../utils/gasto_insuProd');

module.exports = (app) => {

   //Atributes
   let flagLogin = false;
   let globalEmail;
   let firstName;
   let lastName;
   let globalConec = {
      insuComf: comf = [1],
      prodComf: comf = [1],
      statusCc: 'sin status'
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
                     /*type: 'OAuth2',
                     clientId: process.env.EM_IDUSER,
                     clientSecret: process.env.EM_CLISECR,*/
                     user: process.env.EM_USER,
                     pass:process.env.EM_PASS,
                     /*refreshToken: process.env.EM_REFRTOK, 
                     accessToken: accessToken */
                  },
                  tls: {
                     rejectUnauthorized: false
                   }
               });
               
                let info = await transporter.sendMail({
                   from: '<naturanalogs@gmail.com>', 
                   cc: '<naturanalogs@gmail.com>',
                   to: globalConec.e__mail, 
                   subject: "Tu usuario y contraseña para naturana 🙂", // Subject line
                   html: `<b>NATURANA REGISTROS</b><br><p>Su usuario es : ${globalConec.usuario}<p><br><p>Su contraseña es : ${globalConec.password}`, // html body
                }, (error, response) => {
                  error ? console.log(error) : console.log(response);
                  transporter.close();
               });

               console.log("Message sent: %s", info);
               
                }
               
                main().catch(console.error);
                                 
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

      let insuComf = globalConec.insuComf;
      let alert = globalConec.alert;
      let alert1 = globalConec.alert1;
      let alert2 = globalConec.alert2;

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
            try {

               connection.query('SELECT * FROM insumos', async (err1,result1) => {
                  //console.log(result1);
                  if (err1) {
                     console.log(err1);
                  }else{

                    await connection.query('SELECT * FROM producto',(err2,result2) =>{
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
                              alertMessage: "Inventario actualizado",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer: 25000

                           });

                        }
                     })

                  }
               })

               globalConec.alert = 'undefined';
               globalConec.alert1 = 'undefined';
               globalConec.alert2 = 'undefined';

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

   });

   app.get('/pedido', async (req, res) => {

      let prodComf = globalConec.prodComf;
      let cliente = globalConec.clienteExitoso;
      let pedido = globalConec.pedidoExitoso;

      console.log(cliente);
      console.log(pedido);

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else {
         try {
            await connection.query("SELECT * FROM cliente",async (err1,result1) =>{
               try {
                  result1.map( (result) => {
                     dateTransformer.resultToTable(result);
                   });
                  await connection.query("SELECT * FROM producto",async (err,result2)=>{
                      try {
                         if (cliente===true) {
    
                            res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                               firstName:firstName,
                               lastName:lastName,
                               cliente:result1,
                               producto:result2,
                               prodComf:prodComf,
                               alert3:cliente,
                               alert2:pedido,
                               alertTitle: 'Registro',
                               alertMessage: "Registro Exitoso",
                               alertIcon: "success",
                               showConfirmButton: false,
                               timer: 1500
                               
                            });
                            globalConec.clienteExitoso='false';
                           
                         }else if (cliente==='false2' || pedido==='false1') {
                           res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                              firstName:firstName,
                              lastName:lastName,
                              cliente:result1,
                              producto:result2,
                              prodComf:prodComf,
                              alert4:cliente,
                              alert2:pedido
                           });
                           globalConec.clienteExitoso='false';
                         }
                         else if (pedido===true) {
     
                            res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                               firstName:firstName,
                               lastName:lastName,
                               cliente:result1,
                               producto:result2,
                               prodComf:prodComf,
                               alert1:pedido,
                               alert4:cliente,
                               alertTitle: 'Pedido registrado',
                               alertMessage: "Exito",
                               alertIcon: "success",
                               showConfirmButton: false,
                               timer: 1500,
                               
                            });
                            globalConec.pedidoExitoso='false';
                         }
                           else{
                            res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                               firstName:firstName,
                               lastName:lastName,
                               producto:result2,
                               cliente:result1,
                               prodComf:prodComf,
                               alert2:true,
                               alert4:true
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
             }

            });
         } catch (error) {
            console.error(`Error del primer try ${error}`);
            console.error(`Error del primer query ${err}`);
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

   app.get('/despacho', async (req, res) => {

      let idped = globalConec.idped;
      let alert = globalConec.statusCc;

      console.log(idped);

      await connection.query("SELECT * FROM pedido ",
      async (err, results) => {
        if (err) {
           console.log(err);
        }else{

            await results.map( (result) => {
               dateTransformer.resultToTable(result);
            });

            await enteros.resultado(results);

               res.render('../views/main/ventanas/despacho/despacho.ejs', {
                  pedido: results,
                  firstName: firstName,
                  lastName: lastName,
                  alert:alert,
                  alert1:alert,
                  idped:idped,
                  ruta: `cuentaCobro/${idped}`,
                  status:alert
               });
         } 

      }) 
      globalConec.statusCc = 'sin status';
   });

   app.get("/generaCobro/:referencia", async (req, res) => {
      const id = req.params.referencia;
      globalConec.idped = id;

      await connection.query('SELECT * FROM pedido WHERE referencia = ?',id
      , async (err,results) => {

         await results.map( (result) => {
            dateTransformer.resultToTable(result);
         });

         console.log(results);

         if (err) {
            console.log(err);

         }else if (results[0].statusCc === 'preparado'){
            
            globalConec.statusCc = 'rechazo';
            let rechazo= globalConec.statusCc;

            await connection.query('UPDATE pedido SET ? WHERE referencia = ?',[{
               statusCc:rechazo
            },id],(err,result) => {
               if (err) {
                  console.log(err);
               }else{
                  console.log(result);
                  res.redirect('/despacho');
            
               }
            })
            
         }else if (results[0].statusCc === 'rechazo'){
            globalConec.statusCc = 'rechazo';
            res.redirect('/despacho');

         }else if (results[0].statusCc === 'sin status'){

            globalConec.statusCc='preparado';
            let preparado = globalConec.statusCc;

            await connection.query('UPDATE pedido SET ? WHERE referencia = ?',[{
               statusCc:preparado
            },id],(err,result) => {
               if (err) {
                  console.log(err);
               }else{
                  console.log(result);
                  res.redirect('/despacho');
               }
            })

         }
      })


   });

   app.get('/cancelCobro', async (req, res) => {
      
      globalConec.statusCc = 'sin status';
      let rechazo = 'sin status';
      let id = globalConec.idped;

      console.log(id);

      await connection.query('UPDATE pedido SET ? WHERE referencia = ?',[{
         statusCc:rechazo
      },id],(err,result) => {
         if (err) {
            console.log(err);
         }else{
            console.log(result);
            res.redirect('/despacho');
         }
      })

   });

   app.get('/cuentaCobro/:id', async (req, res) => {

   const id1 = req.params.id;

   await connection.query('SELECT * FROM cuenta_c WHERE id__ped = ?',[id1],
   async (err,result1) => {
     
      console.log(result1);
      
      if (err) {
         console.log(err);
      }else if (result1.length===0) {

         await connection.query('INSERT INTO cuenta_c SET ?',{
            id__ped:id1
         },async (err2,result2) => {
            if (err2) {
               console.log(err2);
            }else{
               
              await connection.query('SELECT * FROM cliente LEFT JOIN pedido ON cliente.id = pedido.id_cliente LEFT JOIN cuenta_c ON pedido.referencia = cuenta_c.id__ped WHERE pedido.referencia = ? UNION SELECT * FROM cliente RIGHT JOIN pedido ON cliente.id = pedido.id_cliente RIGHT JOIN cuenta_c ON pedido.referencia = cuenta_c.id__ped WHERE pedido.referencia = ?',
               [id1,id1]
               ,async (err3,result3) => {
                  if (err3) {
                     console.log(err3);
                  }else{

                     result3.map( (result) => {
                        dateTransformer.resultToTable(result);
                      });

                     // console.log(result3[0]);

                     await connection.query('SELECT * FROM produc_gasto INNER JOIN producto ON produc_gasto.id_prod = producto.id WHERE produc_gasto.id_ped = ?',
                     [id1],(err4,result4)=>{
                        if (err4) {
                           console.log(err4);
                        }else {

                           //console.log(result4);

                           let resultados = {
                              result3:result3[0],
                              result4:result4
                           }

                           console.log(resultados);

                           res.render('../views/main/ventanas/cuentaCobro/cuentaCobro.ejs',{
                              cuenta_c: resultados
                           });
                        }
                     })
                     
                  }
               })
            }
         })
      }else{
         //globalConec.statusCc = 'rechazo';
         res.redirect('/despacho');
      }
   })

   });

   app.get('/listaCc',(req,res) => {

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

            res.render('../views/main/ventanas/listaCc/listaCc.ejs', {
            pedido: results,
            firstName: firstName,
            lastName: lastName,
            ruta: 'cuentaCobro'

           });
         }
      })
   });

   app.get('/cuentaCobro_list/:id', async (req, res) => {

      const id = req.params.id;

      await connection.query('SELECT * FROM cliente LEFT JOIN pedido ON cliente.id = pedido.id_cliente LEFT JOIN cuenta_c ON pedido.referencia = cuenta_c.id__ped WHERE pedido.referencia = ? UNION SELECT * FROM cliente RIGHT JOIN pedido ON cliente.id = pedido.id_cliente RIGHT JOIN cuenta_c ON pedido.referencia = cuenta_c.id__ped WHERE pedido.referencia = ?',
               [id,id]
               ,async (err3,result3) => {
                  if (err3) {
                     console.log(err3);
                  }else{

                     result3.map( (result) => {
                        dateTransformer.resultToTable(result);
                      });

                     await connection.query('SELECT * FROM produc_gasto INNER JOIN producto ON produc_gasto.id_prod = producto.id WHERE produc_gasto.id_ped = ?',
                     [id],(err4,result4)=>{
                        if (err4) {
                           console.log(err4);
                        }else {

                           let resultados = {
                              result3:result3[0],
                              result4:result4
                           }

                           console.log(resultados);

                           res.render('../views/main/ventanas/cuentaCobro/cuentaCobro.ejs',{
                              cuenta_c: resultados
                           });
                        }
                     })
                     
                  }
               })

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

      globalConec.clienteExitoso = 'false';
      globalConec.pedidoExitoso = 'false';

      const {Nombre,Apellido,Apellido2,Cedula,Email,direccion,ciudad,telefono,telefono2,F_nacimiento} = req.body;
      console.log(req.body);
      try {
         connection.query('SELECT * FROM cliente WHERE id =?', [Cedula], (err, results)=>{

            if (err) {
               console.log(err);
            }else if (results.length === 0){
               
               globalConec.clienteExitoso = true;

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
                  
                  res.redirect('/pedido');
                }
               })
            }
            else{
               globalConec.clienteExitoso = 'false2';
               res.redirect('/pedido');

            }
         })
      } catch (error) {
         console.log(err);
      }
      
   });
   
   app.post("/despachar/:referencia", (req, res) => {
      const id = req.params.referencia;
   
      console.log(id);
   
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

   app.post("/entregar/:referencia", (req, res) => {
      const id = req.params.referencia;
   
      console.log(id);
   
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

   app.post("/inventario", async (req,res) => {

      globalConec.alert = 'undefined';
      globalConec.alert1 = 'undefined';
      globalConec.alert2 = 'undefined';

      const {selec_inv,referencia,producto,cantidad,valor,descripcion,ref_insu_pro,cant_insu_pro} = req.body;

      let cantI = ref_insu_pro.length;

      // console.log(ref_insu_pro);
      // console.log(cant_insu_pro);
      
      if (selec_inv==='2') {
         
         await connection.query('SELECT * FROM insumos WHERE id =?',referencia, async (err, result1) => {

            if (err) {
               console.log(err);
            }
            else if (result1.length===0) {
               await connection.query('INSERT INTO insumos SET ?',{

                  id:referencia,
                  nombre:producto,
                  cantidad_insu:cantidad,
                  valor_unit:valor,
                  descripcion:descripcion
         
            }, async (err,result2) => {
               if (err) {
                  console.log(err);
               }else{
                  console.log(result2);
                  globalConec.alert = true;
                  res.redirect('/insumo');
               }
            })
            }else if (result1.lengt != 0 ){
               globalConec.alert1 = true;
               res.redirect('/insumo');
               //aviso id repetido
            }

      })

      }else if (selec_inv==='1') {
         
         await connection.query('SELECT * FROM producto WHERE id =?', referencia, async (err,result1) => {
            if (err) {
               console.log(err);
            }else if (result1.length===0){

               await connection.query('INSERT INTO producto SET ?',{

                  id:referencia,
                  nombre:producto,
                  cantidad_Tien:cantidad,
                  valor_unit:valor,
                  descripcion:descripcion,
                  cantidad_ins_consum:cantI
         
            }, async (err1,result2) => {
               if (err1) {
                  console.log(err1);
               }else{
                  
                  gasto.addInsu(ref_insu_pro,cant_insu_pro,referencia).then((cantInsu)=>gasto.insertRest(cantInsu,ref_insu_pro,cant_insu_pro))
                  .catch((err2_0) => setImmediate(() => { throw err2_0; }));

                  res.redirect('/insumo');
                  // gasto.resultado = [];
                  // gasto.cantInsu = [];
                  globalConec.alert=true;

                  // console.log(gasto.resultado);
                  // console.log(gasto.cantInsu);
               }
            })

            }else if (result1.length !== 0) {
               //aviso id repetido
               globalConec.alert1 = true;
               res.redirect('/insumo');
            }
         })

      }else if (selec_inv !== '1' || selec_inv !== '2'){
         //aviso escoja un inventario
         globalConec.alert2 = true;
         res.redirect('/insumo');

      }
      
   });

   app.post("/pedido", async (req,res) => {

      globalConec.clienteExitoso = 'false';
      globalConec.pedidoExitoso = 'false';

      const {idCli__ped,ciuCobro__ped,pago__ped,referencia,fechIng__ped,fechEnt__ped,ref_pro_ped,cant_pro_ped} = req.body;
      
      let cantP = ref_pro_ped.length;

      await connection.query('SELECT * FROM pedido WHERE referencia = ?', [referencia],
      async (err1,result1) => {
         if (err1) {
            console.log(err1);

         }else if (result1.length===0) {
            globalConec.pedidoExitoso = true;

            await connection.query('INSERT INTO pedido SET ?',{
               id_cliente:idCli__ped,
               form_pago:pago__ped,
               ciudadCob:ciuCobro__ped,
               fech_ingr:fechIng__ped,
               fech_entr:fechEnt__ped,
               referencia:referencia,
               est_desp:1,
               est_recep:1,
               cant_pro:cantP,
               statusCc:'sin status'
            },async (err2,result2) => {
               if (err2) {
                  console.log(err2);
               }else{
                  
                  for (let i = 0; i < ref_pro_ped.length; i++) {
                           
                    await connection.query('INSERT INTO produc_gasto SET ?',{
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
            globalConec.pedidoExitoso = 'false1';
            res.redirect('/pedido');
         }
         
      })
   
   });


};