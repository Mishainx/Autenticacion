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
let purchaseButton = document.getElementById("purchaseButton")

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

socket.once("emptyCart", async (data)=>{
    let emptyP= document.createElement("p")
    emptyP.innerText =  `${data}`
    emptyP.style.textAlign = "center" 
    cartContainer.appendChild(emptyP)
    purchaseButton.style.display = "none"
})

let buy = async()=>{
    fetch("/current", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
      }})
    .then((response)=>response.json())
    .then((data)=>{
        fetch(`/api/carts/${data.cart}/purchase`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: data.user,
              cart: data.cart
            }),
          })
            .then((res) => res.json())
            .then((data) =>  {
                cartContainer.innerHTML = ""
                
                let buyMessage = document.createElement("p")
                buyMessage.innerText = data.payload.purcharser? `Su compra se ha realizado con éxito.\n\n Un email ha sido enviado a su casilla con la información de compra.`: ""
                buyMessage.classList.add("buyP")
                buyMessage.style.textAlign = "center"

                let buyCode = document.createElement("p")
                buyCode.innerText = `Código de compra: ${data.payload.code}`
                buyCode.classList.add("buyP")

                let buyPurcharser = document.createElement("p")
                buyPurcharser.innerText = data.payload.purcharser?`Usuario: ${data.payload.purcharser}`: ""
                buyPurcharser.classList.add("buyP")

                let buyDate = document.createElement("p")
                buyDate.innerText = `Fecha: ${data.payload.purchase_datetime}`
                buyDate.classList.add("buyP")

                let buyAmount = document.createElement("p")
                buyAmount.innerText = `Total de la compra: $ ${data.payload.amount}`
                buyAmount.classList.add("buyP")

                let backButton = document.createElement("button")
                backButton.innerText = "Volver al inicio"
                backButton.id = "backButton"

                cartContainer.append(buyMessage,buyCode,buyPurcharser,buyDate,buyAmount,backButton)

                backButton.addEventListener("click",()=>{
                    location.href="/api/views/products"
                })
            })
    } )  
}

purchaseButton.addEventListener("click", buy)
