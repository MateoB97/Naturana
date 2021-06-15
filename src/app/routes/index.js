
const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');

module.exports = (app) =>{

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

   app.get('/pedido' , async (req , res)=>{
      let cont=0;
      if (flagLogin=== false) {
         res.render('../views/main/ventanas/login/login.ejs');
      }else if(cont===0){
         await connection.query("SELECT firstName, lastName FROM users WHERE (rol='Recepcionista' OR rol='Administrador' OR rol='Cajero') and user= ?",globalEmail,(err, result)=>{
            
            try {
               res.render('../views/main/ventanas/pedido/pedido.ejs',{
                  name:result[0].firstName,
                  lastName: result[0].lastName,

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
      
      // //Query for client
      // connection.query("SELECT * FROM cliente",(err,result1)=>{
      //    console.log(result);
      //    try {
      //       res.render('../views/main/ventanas/pedido/pedido.ejs',{
      //          cliente:result
      //       });
      //    } catch (error) {
      //       console.error(`Error del try ${error}`);
      //       console.error(`Error de la consulta ${err}`);
      //    }
      // });

      // Query for product
   //    connection.query("SELECT * FROM producto",(err,result2)=>{
   //       try {
   //          res.status(200).render('../views/main/ventanas/pedido/pedido.ejs',{
   //             producto:result
   //          });
   //       } catch (error) {
   //          console.error(`Error del try ${error}`);
   //          console.error(`Error de la consulta ${err}`);
   //       }
   //    });

   });


   //Example Clear after found a solutions
   // app.get('/pedidoCliente' , (req , res)=>{
   
   //    //Query for client
      
   //    connection.query("SELECT * FROM cliente",(err,result)=>{
   //       console.log(result);
   //       try {
   //          res.render('../views/main/ventanas/pedido/pedido.ejs',{
   //             cliente:result
   //          });
   //       } catch (error) {
   //          console.error(`Error del try ${error}`);
   //          console.error(`Error de la consulta ${err}`);
   //       }
   //    });
   
   // })
   
   app.get('/producto' , (req , res)=>{
      let cont=0;
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


<<<<<<< HEAD
   //Registro de usuarios
   app.post('/auth' , async(req , res)=>{
      
      const formulario = document.getElementById('formulario');
const input = document.querySelectorAll('#formulario input');


const expresiones = {
	//usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    cargo: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	//password: /^.{4,12}$/, // 4 a 12 digitos.
	//correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	cedula: /^\d{7,14}$/, // 7 a 14 numeros.
}

const campos = {
    nombre: false,
    apellido: false,
    cargo: false,
    cedula: false,
   /* horario: false*/
}
const validarFormulario = (e)=>{

    switch(e.target.name) {
        case "Nombre":
            validarCampo(expresiones.nombre, e.target, 'Nombre');
            break;
        case "Apellido":
            validarCampo(expresiones.apellido, e.target, 'Apellido');
            break;
        case "Cedula":
            validarCampo(expresiones.cedula, e.target, 'Cedula');
            break;
        case "Cargo":
            validarCampo(expresiones.cargo, e.target, 'Cargo');
            break;
        /*case "Horario":
            validarHorario(expresiones.horario, e.target, 'Horario');
            break;*/
    }
};

const validarCampo = (expression,input,campo) =>{
    if (expression.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        campos[campo] = true;
    }  else{
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        campos[campo] = false;
    }
}


input.forEach((input) => {
input.addEventListener('keyup', validarFormulario);
input.addEventListener('blur', validarFormulario);
})

formulario.addEventListener('submit' ,(e)=>{
 e.preventDefault();
 const terminos = document.getElementById('Terminos');
 if (campos.nombre && campos.apellido && campos.cargo && campos.cedula && /*campos.horario &&*/ terminos.checked ) {
     formulario.reset();

     document.getElementById('formulario__mensaje-exito').classList.add('formulario_mensaje-exito-activo');
     setTimeout(()=>{
        document.getElementById('formulario__mensaje-exito').classList.remove('formulario_mensaje-exito-activo'); 
     }, 5000)

     document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
         icono.classList.remove('formulario__grupo-correcto');
     })
 }else{
     document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');

 }
});
   });

=======



   //posts
>>>>>>> 8627c631efb2890ed508b8cd7d976e1418551757
    //Login for users 
    app.post('/auth' , async(req , res)=>{

        const {email, password}  = req.body;
         globalEmail=email;  
         if (email && password) {
            connection.query('SELECT user, pass, rol FROM users WHERE user= ?', email, async(err,results)=>{
               try {
                  console.log(results);
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
                              ruta:'pedido'
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
                  res.redirect('/');
               }
            });
         }
     });

     app.post('/session-out' , (req , res)=>{
      flagLogin=false;
      res.render('../views/main/ventanas/login/login.ejs');
      });
}
