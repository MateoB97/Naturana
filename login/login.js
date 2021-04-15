

function iniciarSesion(event){
    let vectorPass=[];
    let vectorEmail=[];

    let vector=['Neiver@gmail.com','MateoP@gmail.com','MateoR@gmail.com','Jairo3@gmail.com'];

    let email = document.getElementById('exampleInputEmail1').value;
    let pass = document.getElementById('exampleInputPassword1').value;
    
    if (email.length!==0 && pass.length!==0) {
        event.preventDefault();
        vectorEmail.push(email);
        vectorPass.push(pass);
    
        for (const emailS of vector) {
            for (const n of vectorEmail) {
                if (n===emailS) {
                    alert('El usuario ya se encuentra en el sistema');
                    
                }
            }
        }
        console.log('Información de emails '+ vector);
        console.log(vectorEmail);
        console.log(vectorPass);
    }else if (email.length===0) {
        alert('El email no pueden ir vacido');
    }else if (pass.length===0) {
        alert('La contraseña no pueden ir vacido');
    }





}