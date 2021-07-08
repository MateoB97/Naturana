
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');
const mysql = require('mysql');

module.exports = (app) => {

   //Atributes
   let flagLogin = false;
   let globalEmail;

   //Routes and connection  with views and database

   //gets
   app.get('/', (req, res) => {
      res.render('../views/main/ventanas/login/login.ejs');
   });

   app.get('/insumo', (req, res) => {
      let cont = 0;
      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else if (cont === 0) {
         connection.query("SELECT firstName, lastName FROM insumo WHERE rol='ejemplo' AND user = ?", globalEmail, (err, result) => {
            try {
               res.render('../views/main/ventanas/insumo/insumo.ejs', {
                  name: result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
         });

      } else if (cont !== 0) {
         flagLogin = false;
         globalEmail = '';
         res.redirect('/');
      }

   });

   app.get('/pedido', async (req, res) => {
      let cont = 0;
      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else if (cont === 0) {
         await connection.query("SELECT firstName, lastName FROM users WHERE (rol='Recepcionista' OR rol='Administrador' OR rol='Cajero') and user= ?", globalEmail, async(err, result) => {
            try {
               await connection.query("SELECT * FROM cliente", (err, result1) => {
                  try {
                        connection.query("SELECT * FROM producto",(err,result2)=>{
                           try {
                              res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
                                 firstName:result[0].firstName,
                                 lastName:result[0].lastName,
                                 cliente:result1,
                                 producto:result2
                              });
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
         });

      } else if (cont !== 0) {
         flagLogin = false;
         globalEmail = '';
         res.redirect('/');
      }
   });

   app.get('/producto', (req, res) => {
      let cont = 0;
      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else if (cont === 0) {
         connection.query("SELECT firstName, lastName FROM users WHERE rol='ejemplo' AND user= ?", globalEmail, (err, result) => {
            try {
               res.render('../views/main/ventanas/producto/producto.ejs', {
                  firstName: result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error del query ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
         });

      } else if (cont !== 0) {
         flagLogin = false;
         globalEmail = '';
         res.redirect('/');
      }
   });

   app.get('/usuario', (req, res) => {
      let cont = 0;
      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else if (cont === 0) {
         connection.query("SELECT firstName, lastName, rol FROM users WHERE rol='Administrador' AND user =?", globalEmail, (err, result) => {
            try {
               res.render('../views/main/ventanas/usuario/usuario.ejs', {
                  firstName: result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(`Error del try ${error}`);
               console.error(`Error de la consulta ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');

            }
         });

      } else if (cont !== 0) {
         res.redirect('/');
         globalEmail = '';
      }
   });

   app.get('/cliente', (req, res)=>{
      let cont=0;
      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         connection.query("SELECT firstName, lastName, rol FROM users WHERE rol='Administrador' AND user =?",globalEmail,(err, result)=>{
            try {
               res.render('../views/main/ventanas/cliente/cliente.ejs',{
                  firstName: result[0].firstName,
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

      if (flagLogin === false) {
         res.render('../views/main/ventanas/login/login.ejs');
      } else if (cont === 0) {
         connection.query("SELECT firstName, lastName FROM users WHERE rol = 'Administrador' AND user= ?", globalEmail, (err, result) => {
            try {
               res.render('../views/main/main.ejs', {
                  firstName: result[0].firstName,
                  lastName: result[0].lastName
               });
            } catch (error) {
               console.error(` Error del catch ${error}`);
               console.error(` Error del query ${err}`);
               flagLogin = false;
               globalEmail = '';
               res.redirect('/');
            }
            //Here
            cont++;
         });
         //Ask to Jairo
      } else if (cont !== 0) {
         globalEmail = '';
         //res.redirect('/');

      }

   });

   //posts

   //Login for users 
   
   app.post('/auth', async (req, res) => {
      
      const { email, password } = req.body;
      globalEmail = email; 
      if (email && password) {
         connection.query('SELECT user, pass, rol FROM users WHERE user= ?', email, async (err, results) => {
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
      res.render('../views/main/ventanas/login/login.ejs');
      });
   
   app.post('/usu_input', async(req, res) => {
      
      const {Nombre,Apellido,Cedula,Cargo,Horario,P_seg,R_seg} = req.body;

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

     //hay que validar que no se repita el id, porque tumba el sv

     try {
      connection.query('SELECT * FROM users WHERE id =?',[Cedula], async (err, results) => {
            
            if (err) {
               console.log('este es tu error' + err);
            }else if (results[0].length===0) {
               let usuario = generaUsu(Nombre,Apellido,Cedula);
               let password = generaPass(Cedula,Nombre,Apellido,Cargo);
               
               let encrip = await bcryptjs.hash(password, 8);

               connection.query('INSERT INTO users SET ?', {
                  cedula: Cedula,
                  user: usuario,
                  firstName: Nombre,
                  lastName: Apellido,
                  rol: Cargo,
                  pass: encrip,
                  horario: Horario,
                  p_seg: P_seg,
                  r_seg: R_seg
         
              }, (err)=>{
               if (err) { 
                   console.log(err);
               }else{
                  /*connection.query('SELECT pass FROM users WHERE id = ?', [Cedula], (err, results) => {

                     if (err) {
                        console.log(err);
                     }else{
                        let pass = results[0].pass
                        let desencrip = await bcryptjs.compare(pass)
                        res.render('../views/main/ventanas/usuario/usuario.ejs', {
                           alert:true,
                           alertTitle: 'Registro',
                           alertMessage: "Registro Exitoso",
                           alertIcon: "success",
                           showConfirmButton: false,
                           timer: 1500,
                           ruta: "usuario"
                       })
                     }
                  })*/
                   res.render('../views/main/ventanas/usuario/usuario.ejs', {
                       alert:true,
                       alertTitle: 'Registro',
                       alertMessage: "Registro Exitoso",
                       alertIcon: "success",
                       showConfirmButton: false,
                       timer: 1500,
                       ruta: "main"
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
                  ruta: 'main'
               });   
            }
      });
     } catch (error) {
        console.log(error);
     }

   });

   app.post('/cli_input', (req,res)=>{

      const {Nombre,Apellido,Cedula,Email,direccion,ciudad,celular,telefono,F_nacimiento} = req.body;

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

     },async(err)=>{
      if (err) {
          console.log(err);
      }else{
          res.render('../views/main/ventanas/cliente/cliente.ejs', {
              alert:true,
              alertTitle: 'Registro',
              alertMessage: "Registro Exitoso",
              alertIcon: "success",
              showConfirmButton: false,
              timer: 1500,
              ruta: "cliente"
          })
          }
      })


   });

}
