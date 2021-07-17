
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');
const mysql = require('mysql');

module.exports = (app) => {

   //Atributes
   let flagLogin = false;
   let globalEmail;
   let firstName;
   let lastName;
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
                     if (req.session.clienteExitoso) {
                        req.session.clienteExitoso=false;
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
                     if (req.session.pedidoExitoso) {
                        req.session.pedidoExitoso=false;
                        res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                           firstName:firstName,
                           lastName:lastName,
                           producto:result2,

                           alert:true,
                           alertTitle: 'Pedido regsitrado',
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

   app.get('/cuentaCobro', (req, res) => {

      /*connection.query('SELECT * FROM cliente')*/
      res.render('../views/main/ventanas/cuentaCobro/cuentaCobro.ejs');
      
      /*razon__s,nit,direccion ,telefono, e_mail, celular, ciudad_op, forma_p, codigo, nombre_p, ref_p,cant_p*/   
   })
   //posts

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
      
      const {Nombre,Apellido,Cedula,Cargo,Horario,P__seg,R__seg} = req.body;

      const generaUsu = (Nombre,Apellido,Cedula) => {

         let N = Nombre.slice(0,3);
         let A = Apellido.slice(0,3);
         let C = Cedula.slice(0,3);

         let usuario = (N + A + C);
         return usuario;
     }
      const generaPass = (id,nombre,Lname,rol) => {
        let pass;
         nombre.slice(0,3);
         Lname.slice(0,3);
         id.slice(0,3);
         rol.slice(0,1)

         pass = nombre,Lname,rol,id;

         return pass;
     }
     let usuario = generaUsu(Nombre,Apellido,Cedula);
     let password = generaPass(Cedula,Nombre,Apellido,Cargo);

     try {
      connection.query('SELECT * FROM users WHERE id =?',[Cedula], async (err, results) => {
         
         let encrip = await bcryptjs.hash(password, 8);

            if (err) {
               console.log('este es tu error' + err);
            }else if (results.length===0) {
               
               connection.query('INSERT INTO users SET ?', {
                  id: Cedula,
                  user: usuario,
                  firstName: Nombre,
                  lastName: Apellido,
                  rol: Cargo,
                  pass: encrip,
                  horario: Horario,
                  p_seg: P__seg,
                  r_seg: R__seg
         
              }, (err,results)=>{
               if (err) { 
                   console.log(err);
               }else{
                  
                   res.render('../views/main/ventanas/usuario/usuario.ejs', {
                       alert:true,
                       alertTitle: 'Registro',
                       alertMessage: "Registro Exitoso",
                       alertIcon: "success",
                       showConfirmButton: false,
                       timer: 25000,
                       ruta: "usuario",
                       firstName:firstName,
                       lastName:lastName
                     })
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

      const {Nombre,Apellido,Cedula,Email,direccion,ciudad,celular,telefono,F_nacimiento} = req.body;

      try {
         connection.query('SELECT * FROM cliente WHERE id_cliente =?', [Cedula], (err, results)=>{

            if (err) {
               console.log(err);
            }else if (results.length === 0){
               connection.query('INSERT INTO cliente SET ?', {
                  id_cliente: Cedula,
                  email: Email,
                  nombre: Nombre,
                  apellido: Apellido,
                  direccion: direccion,
                  ciudad: ciudad,
                  celular: celular,
                  telefono: telefono,
                  F_nacimiento: F_nacimiento
         
              },async(err1,results1)=>{
               if (err) {
                   console.log(err1);
               }else{
                  req.session.clienteExitoso = true;
                  res.redirect('/pedido');

                 /*connection.query('SELECT * FROM producto', (err, result) => {
                     
                     res.render('../views/main/ventanas/pedido/pedido.ejs', {
                        alert:true,
                        alertTitle: 'Registro',
                        alertMessage: "Registro Exitoso",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: "pedido",
                        firstName:firstName,
                        lastName:lastName,
                        pedido:result,

                    })
                  })*/

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

   app.post('/bus_pro', async(req,res)=>{
      const inpBus_pro = req.body;
      try {
         await connection.query('SELECT * FROM producto WHERE nombre =?',[inpBus_pro], (err2, results2)=>{

            res.render('../views/main/ventanas/pedido/pedido.ejs', {
               producto:results2,
               bandped:bandped,
               firstName:firstName,
               lastName:lastName
            })
         })
      } catch (error) {
         console.error(`error de consulta ${err2}`)
         console.error(`este es tu error try ${error}`)
      }
     // bandped =false;
   })

   app.post('/gen_ped', async (req,res)=>{

      const {idCli__ped ,pago__ped,fechIng__ped,fechEnt__ped,idPro__ped, cantPro__ped,estRecep__ped,estDesp__ped} = req.body;

      connection.query('INSERT INTO pedido SET ?', {
         id_1:idPro__ped,
         id_cliente_1:idCli__ped,
         form_pago:pago__ped,
         fech_ingr:fechIng__ped,
         fech_entr:fechEnt__ped,
         cant_pro:cantPro__ped,
         est_recep:estRecep__ped,
         est_desp:estDesp__ped
      }, (err,result) => {
         if (err) {
            console.log(err);
         }else{
            req.session.pedidoExitoso = true;
            res.redirect('/pedido');
         }
      })
   });

   app.post('/cuentaCob', async(req,res) => {

      const {forma_p,vr_uni__p,precio_letras,efectivo,e_mail_env,aceptado,fecha_entrega, fecha_op} = req.body;

    
      
      
      /*vr_total__p,vr_total,rt_fuente,rt_fuente__vrT*/
   });

}
