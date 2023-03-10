import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import routerViews from "./routes/views.routes.js";
import messageRoute from "./routes/messages.routes.js";
import {messageModel } from "./data/models/messages.model.js";
import { CartManager, ProductManager } from "./data/classes/DBManager.js";
import { productModel } from "./data/models/products.model.js";
import cartModel from "./data/models/carts.model.js";
const classManager= new ProductManager
const cartManager = new CartManager();
const mensajes = []
import { __dirname } from '../utils.js';
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import sessionsRouter from "./routes/sessions.routes.js";
import rootRouter from "./routes/root.routes.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { assignedCart } from "./routes/views.routes.js";

//Configuración dotenv
dotenv.config();
export const app = express();
const PORT = process.env.SERVER_PORT || 8181;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.tjewfez.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

//Configuración del servidor
const httpServer = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await messageModel.updateMany({},{status:false})
});

//Inicialización Socket server
const socketServer = new Server(httpServer)

//Middelware para trabajar con archivos .Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Mongo store para crear sesiones
app.use(
  session({
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

//Configuración enviroment MongoDB
const environment = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.tjewfez.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(`Error al conectar a MongoDB: ${error}`);
    console.log(DB_USER+DB_PASS+DB_NAME)
  }
};

const isValidStartData = () => {
  if (DB_PASS && DB_USER) return true;
  else return false;
};
console.log("isValidStartData", isValidStartData());
isValidStartData() && environment();

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
    messageModel.create({name:data.user,message:data.message,status:true})  
  });
   
  socket.on("findCode",async(data)=>{
  socket.emit("findCodeResult", await classManager.findCode(data))
  })

  socket.on("createItem", async(data)=>{
    await classManager.create(data)
    socket.emit("renderChanges", await productModel.find())
  })

  socket.on("findId",async (data)=>{
  const productExist = await productModel.findById(data)
  socket.emit("resultFindId", productExist)
  })

  socket.on("deleteItem",async(data)=>{
    await classManager.delete(data)
    socket.emit("renderChanges",await productModel.find())
  })

   socket.on("sendItem",async (data)=>{
      try{
        console.log(assignedCart)
        let selectedCart = await cartModel.find({_id: assignedCart})
        let productExistInCart = selectedCart[0].products.find((product)=>product.product == data.id)
        let checkStock = await productModel.findById(data.id)
        
        if(parseInt(data.quantity)>checkStock.stock){
          let message = "La cantidad solicitada es mayor que el stock disponible"
          socket.emit("stockError",{error:message, checkStock})
          return
        }
        
        if(productExistInCart == undefined){
          selectedCart[0].products.push({product: data.id, quantity: parseInt(data.quantity)})
        }
        else{
          let newQuantity = productExistInCart.quantity + parseInt(data.quantity)
          let productIndex = selectedCart[0].products.findIndex((product)=> product.product == data.id)
          selectedCart[0].products[productIndex].quantity = newQuantity
        }

        let result = await cartModel.updateOne({_id:assignedCart},selectedCart[0])
        socket.emit("addSuccess",{status:"succes", result})
      }
      catch (err) {
        throw err;
      }
    })

    socket.on("deleteItemCart",async(data)=>{
    })
  });

//Rutas express
app.use("/messages", messageRoute);
app.use('/api/views', routerViews)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", rootRouter) // Manejo de ruta raíz