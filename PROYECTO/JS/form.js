var input = document.getElementsByClassName(`formulario__input`);

for(let i=0;i<input.length;i++){
    input[i].addEventListener("keyup", function(){
        if(this.value.length >= 1){
        this.nextElementSibling.classList.add("fijar");
        }
        else{
            this.nextElementSibling.classList.remove("fijar");

        }
    });
}




class producto {
    constructor(name,price,cant){
        this.name = name;
        this.price = price;
        this.cant = cant;
    }

    addProducto (){

    }

    deleteProducto(){

    }

}

class IU {

    showMessage(){
        
    }
}

document.getElementById('form').addEventListener('submit',function(e){
    let name = document.getElementById('Nombre').value;
    let cant = document.getElementById('Cantidad').value;
    let price = document.getElementById('Precio').value;

    console.log(`registro exitoso \n${name}\n ${cant}\n ${price}`);

    let product = new producto(name,cant,price);

    e.preventDefault();


})

