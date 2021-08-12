const util = require('util');
const connection = require('../../config/db');

let gasto1 = {};

function addInsu (ref_insu_pro,cant_insu_pro,referencia){
    let cantInsu = [];
    return new Promise (async(resolve,reject)=>{
   
       for (let i = 0; i < ref_insu_pro.length; i++) {

         console.log('HOLA');

         const promisifiedQuery = util.promisify(connection.query).bind(connection);
         const result2_0=await promisifiedQuery('SELECT cantidad_insu FROM insumos WHERE id = ?',[ref_insu_pro[i]]);

         cantInsu.push(result2_0[0].cantidad_insu);

         console.log('resultado de consulta',result2_0[0].cantidad_insu);
             
             connection.query('INSERT INTO insu_gasto SET ?',{
               cantidad:cant_insu_pro[i],
               id_insum:ref_insu_pro[i],
               id_prod:referencia
   
            },(err3,result3) => {
               if (err3) {
                  console.log(err3);
               }else{
                  console.log(result3);
               }
            })

          console.log('HOLA 2');
       }

      resolve(cantInsu);
    })

 }

 function insertRest (cantInsu,ref_insu_pro,cant_insu_pro){
     
    console.log('cantInsuPro', cant_insu_pro);
    console.log('cantInsu', cantInsu);

    let resultado = resta(cantInsu,cant_insu_pro);

    console.log('resultado',resultado);

    for (let i = 0; i < ref_insu_pro.length; i++) {
       
       connection.query('UPDATE insumos SET ? WHERE id = ?'
       ,[{
          cantidad_insu:resultado[i]
       },ref_insu_pro[i]]
       ,(err,result) => {
          if (err) {
             console.log(err);
          }else{
             console.log(result);
          }
       })
       
    }

 }

function resta (cantInsu,cantGast) {
   let resultado = [];
    for (let i = 0; i < cantGast.length; i++) {
        let resto = cantInsu[i]-cantGast[i];

        resultado.push(resto);
        
    }
    return resultado;
}

gasto1.addInsu = addInsu;
gasto1.insertRest = insertRest;

module.exports = gasto1;