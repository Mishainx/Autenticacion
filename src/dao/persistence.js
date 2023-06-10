import mongoose from "mongoose";
import config from "../config/config.js";
import { messageModel } from "./mongo/models/messages.model.js";

const DB_USER = config.DB_USER;
const DB_PASS = config.DB_PASS;
const DB_NAME = config.DB_NAME;
const DB_CLUSTER = config.MONGO_CLUSTER
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}${DB_CLUSTER}${DB_NAME}?retryWrites=true&w=majority`


let Products;
let Carts;
let Users;
let Messages;

const environment = async () => {
    try {
      await mongoose.connect(
        STRING_CONNECTION
      );
      console.log("Conectado a MongoDB");
    } catch (error) {
      console.log(`Error al conectar a MongoDB: ${error}`);
    }
  };

const isValidStartData = () => {
    if (DB_PASS && DB_USER) return true;
    else return false;
}

const setVariables = async () => {
  await messageModel.updateMany({},{status:false})
    
  const { default: ProductManager } = await import("./mongo/classes/product.mongo.js");
  Products = ProductManager
  const { default: CartManager } = await import("./mongo/classes/cart.mongo.js");
  Carts = CartManager
  const { default: UserManager } = await import("./mongo/classes/user.mongo.js");
  Users = UserManager
  const { default: MessageManager } = await import("./mongo/classes/message.mongo.js");
  Messages = MessageManager
}



const persistence = config.PERSISTENCE;
switch (persistence) {
  case "MONGO":
    console.log("Usando Mongo")
    environment();
    isValidStartData();
    await setVariables()


  break;
  case "MEMORY":
  console.log("Memory en desarrollo Servidor funcionando en MONGO")
  environment();
  isValidStartData();
  await setVariables()
  break;
}



export{
    Products,
    Carts,
    Users,
    Messages,
}