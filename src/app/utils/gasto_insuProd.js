let gasto = {};

function addInsu (ref_insu_pro,cant_insu_pro,referencia){
    let cantInsu = [];
    return new Promise ((resolve,reject)=>{
   
       for (let i = 0; i < ref_insu_pro.length; i++) {

          connection.query('SELECT cantidad_insu FROM insumos WHERE id = ?'
          ,[ref_insu_pro[i]]
          ,(err2_0,result2_0) => {
             if (err2_0) {
                //console.log(err2_0);
                return reject(err2_0);
             }else{
                 cantInsu.push(result2_0[0].cantidad_insu);

                // console.log(result2_0[0].cantidad_insu);
                // gasto.vec(result2_0[0].cantidad_insu)
                // vec.push(result2_0[0]);
                // return resolve(vec);
             }
          })

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

       }
       return resolve(cantInsu);
    })
    
 }

 function insertRest (){
     
    console.log(cant_insu_pro);
    console.log(gasto.cantInsu);

    resta(cantInsu,cant_insu_pro);

    let resultado = gasto.resultado;

    console.log(resultado);

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
    globalConec.alert=true;
    gasto.resultado = [];
    gasto.cantInsu = [];

    console.log(gasto.resultado);
    console.log(gasto.cantInsu);
 }

let resultado = [];

function resta (cantInsu,cantGast) {

    for (let i = 0; i < cantGast.length; i++) {
        let resto = cantInsu[i]-cantGast[i];

        resultado.push(resto);
        
    }
}

gasto.addInsu = addInsu;
gasto.resta = resta;
gasto.cantInsu = cantInsu;
gasto.resultado = resultado;

module.exports = gasto;