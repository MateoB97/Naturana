let dateTransformer = {};


function dateToString(date){
    let options = {year: 'numeric', month: 'long', day: 'numeric', hour12: true, hour: "2-digit", minute: "2-digit"};
    return `${new Date(date).toLocaleDateString("es-ES", options) } `
}


function resultToTable(result){
    result.fech_ingr = dateToString(result.fech_ingr);
    result.fech_entr = dateToString(result.fech_entr);
    result.F_nacimiento = dateToString(result.F_nacimiento);
}


dateTransformer.dateToString = dateToString;
dateTransformer.resultToTable = resultToTable;

module.exports = dateTransformer;