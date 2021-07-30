

function iniciarSesion(event) {

    let vectorPass = [];
    let vectorEmail = [];
    let bandera = false;

    let vector = ['Neiver@gmail.com', 'MateoP@gmail.com', 'MateoR@gmail.com', 'Jairo3@gmail.com'];

    let email = document.getElementById('exampleInputEmail1').value;
    let pass = document.getElementById('exampleInputPassword1').value;

    if (email.length !== 0 && pass.length !== 0) {
        event.preventDefault();

        for (let i = 0; i < email.length; i++) {
            if (email.charCodeAt(i) === 64) {
                bandera = true;
            }
        }

        const data=ValidatorPass(pass);
        
        if (bandera === true && data === true) {
            vectorEmail.push(email);
            vectorPass.push(pass);

            for (const emailS of vector) {
                for (const n of vectorEmail) {
                    if (n === emailS) {
                        alert('El usuario ya se encuentra en el sistema');
                        iniciarSesion(event);
                    }
                }
            }
            
            alert('Inicio de sesión ok, bienvenido a Naturana');
            console.log(vectorEmail);
            console.log(vectorPass);
        } else if (bandera === false) {
            alert('El email no tiene el @, validar');
        }else if (data ===false) {
            alert('La contraseña no cumple con los requisitos recuerde, mínimo 2'
            +' mayúsculas, 3 números');
        }

    } else if (email.length === 0) {
        alert('El email no pueden ir vacido');
    } else if (pass.length === 0) {
        alert('La contraseña no pueden ir vacida');
    }
}


function ValidatorPass(cad){

    let contMayu=0, contNum=0; //contChar=0;

    for (let i = 0; i < cad.length; i++) {

        if (cad.charCodeAt(i)>=65 && cad.charCodeAt(i)<=90) {
            contMayu++;
        }
        if (cad.charCodeAt(i)>=48 && cad.charCodeAt(i)<=57) {
            contNum++;
        }
        // if (cad.charCodeAt(i)===35 || cad.charCodeAt(i)===42) {
        //     contChar++;
        // }
    }
    if (contMayu>=2 && contNum>=3/*&& contChar>=1*/) {
        return true
    }else{
        return false
    }
}


