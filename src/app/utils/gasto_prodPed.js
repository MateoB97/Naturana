const util = require('util');
const connection = require('../../config/db');

let gasto1 = {};

function addInsu (ref_pro_ped,cant_pro_ped,referencia){
    let cantP = [];
    return new Promise (async(resolve,reject)=>{
   
      for (let i = 0; i < ref_pro_ped.length; i++) {

         console.log('HOLA');

         const promisifiedQuery = util.promisify(connection.query).bind(connection);
         const result2_0=await promisifiedQuery('SELECT cantidad_Tien FROM producto WHERE id = ?',[ref_pro_ped[i]]);
      
         cantP.push(result2_0[0].cantidad_Tien);
      
         console.log('resultado de consulta',result2_0[0].cantidad_Tien);
      
         connection.query('INSERT INTO produc_gasto SET ?', {
            cantidad: cant_pro_ped[i],
            id_ped: referencia,
            id_prod: ref_pro_ped[i]
      
         }, (err3, result3) => {
            if (err3) {
               console.log(err3);
            } else {
               console.log(result3);
            }
         })
         
         console.log('HOLA 2');
      }

      resolve(cantP);
    })

 }

 function insertRest (cantP,ref_pro_ped,cant_pro_ped){
     
    console.log('cantInsuPro', cant_pro_ped);
    console.log('cantInsu', cantP);

    let resultado = resta(cantP,cant_pro_ped);

    console.log('resultado',resultado);

    for (let i = 0; i < ref_pro_ped.length; i++) {
       
       connection.query('UPDATE producto SET ? WHERE id = ?'
       ,[{
          cantidad_Tien:resultado[i]
       },ref_pro_ped[i]]
       ,(err,result) => {
          if (err) {
             console.log(err);
          }else{
             console.log(result);
          }
       })
       
    }

 }

function resta (cantP,cantGast) {
   let resultado = [];
    for (let i = 0; i < cantGast.length; i++) {
        let resto = cantP[i]-cantGast[i];

        resultado.push(resto);
        
    }
    return resultado;
}

gasto1.addInsu = addInsu;
gasto1.insertRest = insertRest;

module.exports = gasto1;