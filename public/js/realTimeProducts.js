const socket=io();
let addProductContainer = document.getElementById('addProductContainer')
let addTitleForm = document.getElementById('addTitleForm')
let addDescriptionForm = document.getElementById('addDescriptionForm')
let addPriceForm = document.getElementById('addPriceForm')
let addCodeForm = document.getElementById('addCodeForm')
let addThumbnailForm = document.getElementById('addThumbnailForm')
let addStatusForm = document.getElementById('addStatusForm')
let addStockForm = document.getElementById('addStockForm')
let addCategory = document.getElementById('addCategory')
let addBtnForm = document.getElementById('addBtnForm')
let deleteProductContainer = document.getElementById('deleteProductContainer')
let deleteIdForm = document.getElementById('deleteIdForm')
let deleteIdBtn = document.getElementById('deleteIdBtn')
let addForm = document.getElementById("addForm")
let idInvalida = document.getElementById('idInvalida')
let invalidCode = document.getElementById("invalidCode")
let itemForm ={}
let item;
let findCodeResult;

createItem() // La función createItem se encarga de  tomar la información ingresada por el usuario y generar un nuevo producto
deleteProduct() // La función createItem se encarga de  tomar la información ingresada por el usuario y eliminar un producto existentes

socket.emit("realTimeConnection", "Cliente conectado a Real Time Products") // Aviso al servidor de que se conecto un usuario a la vista

socket.on("findCodeResult", (data)=>{
    if(data==null){
        invalidCode.innerHTML=""
        let succesCodeMsg = document.createElement("p")
        succesCodeMsg.innerText = "Producto agregado exitósamente"
        succesCodeMsg.style.color="rgb(23, 123, 25)"
        invalidCode.append(succesCodeMsg)
        socket.emit("createItem", item)

    }
    else{
        invalidCode.innerHTML=""
        let invalidCodeMsg = document.createElement("p")
        invalidCodeMsg.innerText = "* El código ingresado ya se encuentra en el listado"
        invalidCodeMsg.style.color="rgb(188, 36, 36)"
        invalidCode.append(invalidCodeMsg)
    }
})

function createItem(){
    addBtnForm.addEventListener("click",(Event)=>{
        Event.preventDefault()
        
        const titleValidate = /^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(addTitleForm.value)
        const descriptionValidate = addDescriptionForm.value != undefined
        const priceValidate = addPriceForm.value > 0 
        const codeValidate = addCodeForm.value != undefined
        const stockValidate = addStockForm.value > 0 && addStockForm != undefined
        const categoryValidate = addCategory.value != undefined
        const statusValidate = addStatusForm.value == "True" || addStatusForm.value == "False"

        
        if(titleValidate && descriptionValidate&&priceValidate&&stockValidate&&codeValidate&&categoryValidate){
            socket.emit("findCode", addCodeForm.value)
            item={
                title: addTitleForm.value,
                description: addDescriptionForm.value,
                price: addPriceForm.value,
                stock: addStockForm.value,
                code: addCodeForm.value,
                category: addCategory.value,
                thumbnail: [],
                status: addStatusForm.value == "True"? true:false
            }     
        }
        else{
                item={
                title: addTitleForm.value,
                description: addDescriptionForm.value,
                price: addPriceForm.value,
                stock: addStockForm.value,
                code: addCodeForm.value,
                category: addCategory.value,
                thumbnail: [],
                status: addStatusForm.value == "True"? true:false
        }     

    socket.emit("createCustomError",item )

    invalidCode.innerHTML=""
        let invalidFormMsg = document.createElement("p")
        invalidFormMsg.innerText = "* Formulario completado incorrectamente"
        invalidFormMsg.style.color="rgb(188, 36, 36)"
        invalidCode.append(invalidFormMsg)
}}
)}

//Renderización de cambios en el sistema de forma dinámica
socket.on("renderChanges",(data)=>{
    realTimeProducts.innerHTML = "<h2>Listado de Productos<h2>"
        
            data.forEach(product=>{
                //Render divProduct
                
                let divProduct = document.createElement("div")
                divProduct.classList.add("realTimeItem")
        
                let divProperties = document.createElement("div")
                divProperties.classList.add("homeProperties")
                
                //Render titles
                let productTitle = document.createElement("p")
                productTitle.innerText =  `${product.title}`
        
                
                let productId = document.createElement("p")
                productId.innerText = `Id: ${product._id}`
                productId.classList.add("hideP")
        
                let productDescription = document.createElement("p")
                productDescription.innerText = `Descripción: ${product.description}`
                productDescription.classList.add("hideP")
        
                let productPrice = document.createElement("p")
                productPrice.innerText = `Precio: ${product.price}`
                productPrice.classList.add("hideP")
        
                
                let productStock = document.createElement("p")
                productStock.innerText = `Stock: ${product.stock}`
                productStock.classList.add("hideP")
        
                let productCode = document.createElement("p")
                productCode.innerText = `Code: ${product.code}`
                productCode.classList.add("hideP")
        
                let btnProduct = document.createElement('button')
                btnProduct.innerText = "Ver completo"
                btnProduct.classList.add("btnShow")
        
                //Inserto elementos
                realTimeProducts.append(divProduct)
                divProduct.append(divProperties,btnProduct)
                divProperties.append(productTitle,productId,productDescription,productPrice,productCode)
        
                
        })
        let btnsShow = document.querySelectorAll(".btnShow")
        for(let btn of btnsShow){
            btn.addEventListener("click", showItem)
        }
})

//Función deleteProduct
function deleteProduct(){
    deleteIdBtn.addEventListener("click", function(Event){
        Event.preventDefault()

        const itemDelete = deleteIdForm.value
        const validateId= itemDelete != "" && itemDelete.trim().length == 24



        if(validateId){       
            socket.emit("findId", itemDelete )
        }
        else{
            idInvalida.innerHTML= ""
            let deleteMsg = document.createElement("p")
            deleteMsg.innerText = "* Para eliminar un producto ingrese un Id válida en el formulario"
            deleteMsg.style.color = "rgb(188, 36, 36)"
            idInvalida.appendChild(deleteMsg)
        }
    }
)}

socket.on("resultFindId",(data)=>{
    if(data!=null){
        socket.emit("deleteItem",deleteIdForm.value)
        idInvalida.innerHTML= ""
        let deleteSucces = document.createElement("p")
        deleteSucces.innerText = "* Productos eliminado exitósamente"
        deleteSucces.style.color="rgb(23, 123, 25)"
        idInvalida.appendChild(deleteSucces)
    }
    else{
        idInvalida.innerHTML= ""
        let deleteMsg = document.createElement("p")
        deleteMsg.innerText = "* La Id ingresada no se encuentra en el listado de productos"
        deleteMsg.style.color = "rgb(188, 36, 36)"
        idInvalida.appendChild(deleteMsg)
    }
})

socket.on("unauthorized",(data)=>{
    idInvalida.innerHTML= ""
    let deleteMsg = document.createElement("p")
    deleteMsg.innerText = "* El usuario no posee autorización para eliminar el producto"
    deleteMsg.style.color = "rgb(188, 36, 36)"
    idInvalida.appendChild(deleteMsg)
})

//Funciones necesarias para mostrar el producto completo al clickear en (ver completo)
function showItem(e){
    let child = e.target
    let father = child.parentNode
    let hideP = father.querySelectorAll(".hideP")
    for(let p of hideP){
        p.classList.toggle("active")
    }
}

let btnsShow = document.querySelectorAll(".btnShow")
for(let btn of btnsShow){
    btn.addEventListener("click", showItem)
}