let enteros = {};

function stringToInt (string) {
    let numero = parseInt(string);
    return numero;
};

function resultado (result) {
    for (let i = 0; i < result.length; i++) {
        result[i].referencia = stringToInt(result[i].referencia);
        
    }
    
}

enteros.stringToInt = stringToInt;
enteros.resultado = resultado;

module.exports = enteros;