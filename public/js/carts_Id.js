const socket=io();

let homeNavLink = document.getElementById("homeNavLink")
let productsNavLink = document.getElementById("productsNavLink")
let realTimeNavLink = document.getElementById("realTimeNavLink")
let chatNavLink = document.getElementById("chatNavLink")
let cartNavLink = document.getElementById("cartNavLink")
let profileNavLink = document.getElementById("profileNavLink")
let btnsTrash = document.querySelectorAll(".btnTrash")
let father;
let cartContainer = document.getElementById("cartContainer")

//Configuración Navbar
homeNavLink.href = "/"
realTimeNavLink.href = "/api/views/RealTimeProducts"
productsNavLink.href = "/api/views/products"
chatNavLink.href = "/api/views/chat"
profileNavLink.href = "/profile"
cartNavLink.style.display = "none"

for(let btn of btnsTrash){
    btn.addEventListener("click", deleteItem)
}

    function deleteItem(Event){
    let child = Event.target
    let father = child.parentNode
    let deleteProductId = father.childNodes[1].childNodes[1].childNodes[1].innerText 
    socket.emit("deleteCartItem", deleteProductId)
    father.remove()
}

socket.on("emptyCart", async (data)=>{
    let emptyP= document.createElement("p")
    emptyP.innerText =  `${data}`
    emptyP.style.textAlign = "center" 
    cartContainer.appendChild(emptyP)
    console.log("hola")
})