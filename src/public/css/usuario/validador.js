  
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
        udocument.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formlario__input-error-activo');
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