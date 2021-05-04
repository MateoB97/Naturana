function reciveInfo() {
    
    let id = document.getElementById("id").value;
    let celular = document.getElementById("celular").value;
    let area = document.getElementById("area").value;
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let cargo = document.getElementById("cargo").value;
    let horario = document.getElementById("horario").value;
    let info = document.getElementById("info").value;

    validateData(id,celular,area,nombre,email,cargo,horario,info);
}

let flagEmail=false;
let flagCampEmp=false;

function validateData(id,celular,area,nombre,email,cargo,horario,info) {

    if (id.length!==0 && celular.length!==0 
        && area.length!==0 && nombre.length!==0 && email.length!==0
        && cargo.length!==0 && horario.length!==0 && info.length!==0) 
        {

            const dataEmail = validadorEmail(email);
            const dataCel = validadorCelular(celular);

            if (dataEmail===true && dataCel===true) {
                alert('Información guardado con éxito');
                limpiarCampos();
            }else if (dataEmail===false) {
                alert('Por favor validar el email');
            }else if (dataCel===false) {
                alert('Por favor validar el celular');
            }



    }else if (id.length===0) {
        alert('El campo Número de identificacíon no puede ir vacido');
    }else if (celular.length===0) {
        alert('El campo Celular no puede ir vacido');
    }else if (area.length===0) {
        alert('El campo Área / Operación no puede ir vacido');
    }
    else if (nombre.length===0) {
        alert('El campo Nombre no puede ir vacido');
    }else if (email.length===0) {
        alert('El campo Email Correo puede ir vacido');
    }else if (cargo.length===0) {
        alert('El campo Cargo no puede ir vacido');
    }else if (horario.length===0) {
        alert('El campo Horario en el que te podemos contactar no puede ir vacido');
    }else if (info.length===0) {
        alert('El campo ¿Indícanos donde te encuentras? no puede ir vacido');
    }
}

function validadorEmail(email) {

    for (let i = 0; i < email.length; i++) {
        if (email.charCodeAt(i)===64) {
            flagEmail = true;
        }
    }

    if (flagEmail===false) {
        alert('Recuerde que el correo debe tener una @');
        return false;
    }else if (flagEmail===true) {
        return true;
    }   
}
function validadorCelular(celular) {
    if (celular.NaN || celular.length!==10) {
        alert('Recuerde que el campo de celular debe ser un número / Recuerde que son 10 números');
        return false;
    }else{
        return true;
    }

}
function limpiarCampos(){
    document.getElementById("id").value ="";
    document.getElementById("celular").value ="";
    document.getElementById("area").value ="";
    document.getElementById("nombre").value ="";
    document.getElementById("email").value ="";
    document.getElementById("cargo").value ="";
    document.getElementById("horario").value ="";
    document.getElementById("info").value ="";
}