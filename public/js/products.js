const socket=io();

let buttonsQuantity = document.querySelectorAll(".productQuantityButton")
let listProductsContainer = document.getElementById("listProductsContainer")
let messageDiv = document.getElementById("messageDiv")

const messageDivMessage = (value, message) =>{
    messageDiv.innerHTML= ""
    const messageDivP = document.createElement("p")
    messageDivP.style.textAlign = "center"

    if(value){
        messageDivP.innerText = `${message}`
        messageDivP.style.color = "rgb(23, 123, 25)"
    }
    else{
        messageDivP.innerText = `${message}`
        messageDivP.style.color = "rgb(188, 36, 36)"
    }
    messageDiv.append(messageDivP)
}

//Configuración para agregar el producto al carrito
for(let btn of buttonsQuantity){

    btn.addEventListener("click", addItem)

    function addItem(Event){
        let child = Event.target
        let father = child.parentNode
        let grand = father.parentNode
        let selectedProductId = grand.childNodes[1].childNodes[1].innerText
        let productStock = grand.childNodes[9]

        let item ={
            id: selectedProductId    ,
            quantity: father.querySelector("input").value,
        }


        socket.emit("sendItem", item)


        socket.once("addSuccess",(data)=>{
            if(data.newProduct.stock >0){
                productStock.innerText =  `stock: ${data.newProduct.stock} ` 
            }
            else{
                productStock.innerHTML=""
                father.innerText = "Sin stock"
                father.classList.add("noStock")
            }
        })
    }      
}

socket.on("stockError",(data)=>{
    messageDivMessage(false,data.error)
})

socket.on("addSuccess",(data)=>{
    messageDivMessage(true,"Producto agregado exitosamente")
})

socket.on("unauthorized buy", ()=>{
    messageDivMessage(false,"Compra sin autorización")

})