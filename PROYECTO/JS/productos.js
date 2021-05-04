class Producto{
   constructor(nombre,precio,cantidad){
      this.nombre = nombre;
      this.precio = precio;
      this.cantidad = cantidad;
   }

   getprecio(){
      return this.cantidad;
   }


   showInfo(){
      return `${this.nombre} es un Producto de ${this.precio} y su cantidad es ${this.cantidad}`;
      }
}

let Productos = [];

while(Productos.length<3){

   let nombre = prompt("ingrese nombre");
   let precio = prompt("ingrese precio");
   let cantidad = prompt("ingrese cantidad");

if(nombre != '' && precio != '' && (cantidad == "aventura" || cantidad == "terror")){
   Productos.push(new Producto(nombre,precio,cantidad));
   }
}

const showAllProductos = ()=>{
   console.log(Productos)
}

const showprecioes = () => {
   let precio = [];
   for(const lib of Productos){
      precio.push(lib.getprecio());
   }

   console.log(precio.sort())
   
}



showprecioes()