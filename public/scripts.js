let carrito =[];
let total = 0;

function add(product, price){
    console.log(product, price);
    carrito.push(product);
    total = total + price;
    document.getElementById("checkout").innerHTML = `Total $${total}`
}

function pay(){
    window.alert(products.join(", \n"));
}