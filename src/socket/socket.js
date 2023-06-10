//Errors
import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enum.js";
import { generateProductsErrorInfo } from "../services/errors/info.js";

//DAO
import { Carts } from "../dao/persistence.js";
import { Messages } from "../dao/persistence.js";
import { Products } from "../dao/persistence.js";
const products = await new Products()
const carts = await new Carts()
const message = await new Messages()

//Repositories
import MessageRepository from "../repository/message.repository.js";
import CartRepository from "../repository/cart.repository.js";
import ProductRepository from "../repository/product.repository.js";
import { deleteProductMail } from "../controllers/mail.controllers.js";
const messageRepository = new MessageRepository(message)
const cartRepository = new CartRepository(carts)
const productRepository = new ProductRepository(products)

export const socketModule = (socketServer) =>{
    socketServer.on("connection", async(socket) => {
        let sessionUser = socket.request.session
        let assignedCart = sessionUser.user?.cart
        
          socket.on("message", (data) => {
            mensajes.push(data);
            socketServer.emit("messageLogs", mensajes);
            messageRepository.CreateMessage(mensajes)  
          });
           
          socket.on("findCode",async(data)=>{
          socket.emit("findCodeResult", await productRepository.findCodeProducts(data))
          })
        
          socket.on("createItem", async(data)=>{
            let owner;
            if(sessionUser){
              if(sessionUser.user.role == "Premium"){
                owner = sessionUser.user?.email?sessionUser.user.email:undefined //Para el caso que el usuario proviene de github el email es null  
                data.owner = owner
              }
            }
            productRepository.createProducts(data)
            socket.emit("renderChanges", await productRepository.getProducts())
          })
        
          socket.on("findId",async (data)=>{
          const productExist = await productRepository.getIdProducts(data)
          socket.emit("resultFindId", productExist)
          })
        
          socket.on("deleteItem",async(data)=>{
            let productExist = await productRepository.getIdProducts(data)
            if(sessionUser.user.role == "Premium" && sessionUser.user.email != productExist?.owner){
              socket.emit("unauthorized",productExist)
              return
            }
        
            await productRepository.deleteProducts(data)
            let owner = await productRepository.getOneProducts({email:productExist.owner})
            if (owner && owner.role == "Premium"){
              deleteProductMail(owner.email,data)
            }
            
            socket.emit("renderChanges",await productRepository.getProducts())
          })
        
           socket.on("sendItem",async (data)=>{
              try{
                let selectedCart = await cartRepository.getIdCarts(assignedCart)
                let productExistInCart = selectedCart.products.find((product)=>product.product?._id == data.id)
                let checkStock = await productRepository.getIdProducts(data.id)
        
                if(parseInt(data.quantity)>checkStock.stock){
                  let message = "La cantidad solicitada es mayor que el stock disponible"
                  socket.emit("stockError",{error:message, checkStock})
                  return
                }
        
                if(sessionUser.user.role == "Premium" && checkStock.owner == sessionUser.user.email){
                  socket.emit("unauthorized buy")
                  return
                }
                
                let result = cartRepository.addItemCarts(assignedCart,data.id,data.quantity)
                let product = await productRepository.getIdProducts(data.id)
                let newStock = product.stock-data.quantity
                await productRepository.updateProducts(data.id,{stock:newStock})
                let newProduct = await productRepository.getIdProducts(data.id)
                socket.emit("addSuccess",{status:"succes", result,newProduct})
              }
              catch (err) {
                throw err;
              }
            })
        
            socket.on("deleteCartItem",async(data)=>{
              let deleteProductId = data
              let cart = await cartRepository.getIdCarts(sessionUser.user.cart)
              let product = await productRepository.getIdProducts(deleteProductId)
              let productCart = cart.products.find((product)=>product.product?._id==deleteProductId)
        
              await cartRepository.deleteProductCarts(assignedCart,deleteProductId)
               socket.emit("deleteSuccess", "Producto eliminado exitosamente")
              let newQuantity = product.stock + productCart.quantity 
              cart = await cartRepository.getIdCarts(assignedCart)
              let cartLength = cart.products.length
              if (cartLength == 0){
                socket.emit("emptyCart", "El carrito no cuenta con productos aún")
              }
              await productRepository.updateProducts(deleteProductId,{stock:newQuantity}) 
          });
        
          socket.on("createCustomError",(data)=>{
            try{
              let {title,description,code,price,thumbnail,stock,category,status} = data
              CustomError.createError({
                name:"Product creation error",
                cause: generateProductsErrorInfo({title,description,code,price,thumbnail,stock,category,status}),
                message: "Error trying to create Product",
                code: EErrors.INVALID_TYPES_ERROR
              })
            }
          catch(error){
           console.log(error)
          }
          });
        })
}