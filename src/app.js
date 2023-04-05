import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import routerViews from "./routes/views.routes.js";
import messageRoute from "./routes/messages.routes.js";
const mensajes = []
import { __dirname } from './config/utils.js';
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import sessionsRouter from "./routes/sessions.routes.js";
import rootRouter from "./routes/root.routes.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import  {assignedCart}  from "./controllers/root.controllers.js";
import flash from "connect-flash"
import config from "./config/config.js";
import mailRouter from "./routes/mail.routes.js";
import { Products } from "./dao/persistence.js";
import ProductRepository from "./repository/product.repository.js";
const products = new Products()
import { Carts } from "./dao/persistence.js";
const carts = new Carts()
import CartRepository from "./repository/cart.repository.js";
const productRepository = new ProductRepository(products)
const cartRepository = new CartRepository(carts)
import { Messages } from "./dao/persistence.js";
const message = new Messages()
import MessageRepository from "./repository/message.repository.js";
const messageRepository = new MessageRepository(message)

const PORT = config.PORT ;
const DB_USER = config.DB_USER;
const DB_PASS = config.DB_PASS;
const DB_NAME = config.DB_NAME;
const DB_CLUSTER = config.MONGO_CLUSTER
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}${DB_CLUSTER}${DB_NAME}?retryWrites=true&w=majority`

export const app = express();

//Configuración del servidor
const httpServer = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

//Inicialización Socket server
const socketServer = new Server(httpServer)

//Middelware para trabajar con archivos .Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser y connect-flash
app.use(cookieParser("coderSecret"));
app.use(flash())

//Mongo store para crear sesiones
app.use(session({
  secret: "coderhouse",
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: STRING_CONNECTION,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 1000,
  }),
})
);

//Configuración passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname+"/src/views")
app.use(express.static(__dirname +'/public'));


app.post("/socketMessage", (req, res) => {
  const { message } = req.body;
  socketServer.emit("message", message);

  res.send("ok");
});

// Middleware para agregar a las variables locales del objeto Response los datos de sesión.
app.use((req, res, next)=>{ 
  res.locals.session = req.session;
  next();
})

//Configuración socket server
socketServer.on("connection", async(socket) => {

  socket.on("message", (data) => {
    mensajes.push(data);
    socketServer.emit("messageLogs", mensajes);
    messageRepository.CreateMessage(mensajes)  
  });
   
  socket.on("findCode",async(data)=>{
  socket.emit("findCodeResult", await productRepository.findCodeProducts(data))
  })

  socket.on("createItem", async(data)=>{
    productRepository.createProducts(data)
    socket.emit("renderChanges", await productRepository.getProducts())
  })

  socket.on("findId",async (data)=>{
  const productExist = await productRepository.getIdProducts(data)
  socket.emit("resultFindId", productExist)
  })

  socket.on("deleteItem",async(data)=>{
    await productRepository.deleteProducts(data)
    socket.emit("renderChanges",await productRepository.getProducts())
  })

   socket.on("sendItem",async (data)=>{
      try{
        let selectedCart = await cartRepository.getIdCarts(assignedCart)
        let productExistInCart = selectedCart.products.find((product)=>product.product._id == data.id)
        let checkStock = await productRepository.getIdProducts(data.id)

        if(parseInt(data.quantity)>checkStock.stock){
          let message = "La cantidad solicitada es mayor que el stock disponible"
          socket.emit("stockError",{error:message, checkStock})
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
      let cart = await cartRepository.getIdCarts(assignedCart)
      let product = await productRepository.getIdProducts(deleteProductId)
      let productCart = cart.products.find((product)=>product.product._id==deleteProductId)

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
})

//Rutas express
app.use("/messages", messageRoute);
app.use('/api/views', routerViews)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mail", mailRouter)
app.use("/", rootRouter) // Manejo de ruta raíz