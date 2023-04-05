import { Products } from "../dao/persistence.js";
import ProductRepository from "../repository/product.repository.js";
const products = new Products()
import { Carts } from "../dao/persistence.js";
const carts = new Carts()
import CartRepository from "../repository/cart.repository.js";
const productRepository = new ProductRepository(products)
const cartRepository = new CartRepository(carts)
let response;

const getCarts = async (req, res) => {
    try {
      const cart = await cartRepository.getCarts();
      res.send(cart);
    } catch (err) {
      res.status(500).send(err.message);
    }
}

const getCartId = async (req, res) => {
    try {
      const cartId = req.params.cid
      const cart = await cartRepository.getCarts();
  
      //Comprobación de la estructura del parámetro Id recibido
      if(cartId.trim().length!=24){ 
        res.status(400).send({error: "La Id del Cart ingresada no es válida"})
        return
      }
  
      //Comprobación de la existencia de un carrito con el parámetro ingresado.
      const cartExist = await cartRepository.getIdCarts(cartId)
      if(cartExist==null){
        res.status(404).send({error:"No existe un Cart con la Id ingresada"})
        return
      }
  
      //Si se comprueba el parámetro se ejecutan las acciones para devolver el carrito solicitado.
      const findCart = await cartRepository.getIdCarts(cartId)
      if(findCart !=undefined){
      res.status(200).send(findCart)
      return findCart
      }
      else{
        res.status(400).send("No existe un cart con la Id solicitada")
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
}

const createCart = async (req, res) => {
    try {
      const response = await cartRepository.createCarts();
      res.status(200).send({ message: "Carrito creado", response });
    } catch (err) {
      res.status(500).send(err.message);
    }
}

const deleteCartId = async (req, res) => {
    const { id } = req.params;
    try {
  
      //Comprobación de la estructura del parámetro Id recibido 
      if(id.trim().length!=24){ 
        res.status(400).send({error: "La Id del Cart ingresada no es válida"})
        return
      }
  
      //Comprobación de la existencia de un carrito con el parámetro ingresado.
      const cartExist = await cartRepository.getIdCarts(id)
      if(cartExist==null){
        res.status(404).send({error:"No existe un Cart con la Id ingresada"})
        return
      }
  
      //Si se comprueba la validez del parámetro se ejecutan las acciones para eliminar el carrito.
      let newCart = await cartRepository.deleteAllCarts(id)
      res.status(200).send({ status: "succes", message: 'Productos del carrito eliminados exitósamente', payload: response});
    } catch (err) {
      res.status(500).send(err.message);
    }
}

const addItemToCart = async (req, res) => {
    const  cartId  = req.params.cid;
    const productId = req.params.pid
    const {quantity} = req.body;
  
    //Comprobación de la estructura y validez de la Id de producto y la Id del carrito recibidos por parámetro
    if(productId.trim().length!=24)
    { 
      res.status(400).send({error: "La Id de producto ingresada no es válida"})
      return
    }
    else if(cartId.trim().length!=24){
      res.status(404).send({error: "La Id del Cart ingresada no es válida"})
      return
    }
    const productExist = await productRepository.getIdProducts(productId)
    const cartExist = await cartRepository.getIdCarts(cartId)
  
    if(productExist==null){
      res.status(400).send({error:"No existe un producto con la Id ingresada"})
      return
    }
    else if(cartExist==null){
      res.status(404).send({error:"No existe un Cart con la Id ingresada"})
      return
    }
  
    //Comprobación de stock
    let checkStock = productExist.stock
    if(parseInt(quantity)>checkStock){
      res.status(400).send({status:"Error", message:"No hay stock suficiente para la cantidad solicitada"})
    return
    }
  
    //Si se comprueba la validez de los parámetros se ejecutan las acciones para agregar el producto al carrito
    try {
      let result = cartRepository.addItemCarts(cartId,productId,quantity)
      res.status(200).send({status:"success",message: "Producto agregado exitosamente al carrito", payload: result})  
    }
     catch (err) {
      res.status(500).send(err.message);
    }
}

const deleteItemFromCart = async (req, res) => {
    const  cartId  = req.params.cid;
    const productId = req.params.pid
  
    try {
    //Comprobación de la estructura y validez de la Id de producto y la Id del carrito recibidos por parámetro
      if(productId.trim().length!=24){ 
      res.status(400).send({error: "La Id de producto ingresada no es válida"})
      return
    }
    else if(cartId.trim().length!=24){
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }
  
  
    const productExist = await productRepository.getIdProducts(productId)
    const cartExist = await cartRepository.getIdCarts(cartId)
  
    if(productExist==null){
      res.status(400).send({error:"No existe un producto con la Id ingresada"})
      return
    }
   else if(cartExist==null){
      res.status(400).send({error:"No existe un Cart con la Id ingresada"})
      return
    }
  
      // Comprobación de que el producto exista en el carrito
      let productExistInCart = cartExist.products.find((product)=>product.product._id == productId)
      if(productExistInCart == undefined){
      res.status(400).send({error:"No existe un producto en el carrito con la Id ingresada"})
      return
    }
  
    //Si se comprueba la validez de los parámetros se ejecutan las acciones para eliminar el producto al carrito
      const response = await cartRepository.deleteProductCarts(cartId,productId);
      res.status(200).send({ message: "Producto eliminado del carrito", response });
    } catch (err) {
      res.status(500).send(err.message);
    }
}

const cartUpdate = async(req,res)=>{
    const  cartId  = req.params.cid;
    let newArray = await req.body    
  
    try {
    //Comprobación de la estructura y validez de la Id del carrito recibida por parámetro
    if(cartId.trim().length!=24){
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }
    const cartExist = await cartRepository.getIdCarts(cartId)
  
    if(cartExist==null){
      res.status(400).send({error:"No existe un Cart con la Id ingresada"})
      return
    }
  
    //Si se comprueba la validez de los parámetros se ejecutan las acciones para actualizar el carrito
    // await cartModel.findByIdAndUpdate({_id:cartId},{products:newArray.products})
    await cartRepository.updateCarts()
    let response = await cartRepository.getIdCarts(cartId)
    res.status(200).send({status:'success', message:'El carrito se ha actualizado exitósamente', payload:response})
    }
    catch(err){
      res.status(500).send(err.message);
    }
}

const cartUpdateArray = async(req,res)=>{
  const  cartId  = req.params.cid;
  let newArray = await req.body


  if(cartId.trim().length!=24){
    res.status(400).send({error: "La Id del Cart ingresada no es válida"})
    return
  }
  const cartExist = await cartRepository.getIdCarts(cartId)

  if(cartExist==null){
    res.status(400).send({error:"No existe un Cart con la Id ingresada"})
    return
  }

  try{
    let result = await cartRepository.updateArrayCarts(cartId,newArray)
    res.status(200).send({status:"success",message:"Carrito actualizado", payload:result})
  }
  catch(err){
    res.status(500).send(err.message);
  }
}

const cartUpdateProduct =  async(req,res)=>{
    const  cartId  = req.params.cid;
    const productId = req.params.pid
    const newQuantity = req.body
  
    try {
    //Comprobación de la estructura y validez de la Id de producto y la Id del carrito recibidos por parámetro
      if(productId.trim().length!=24){ 
      res.status(400).send({error: "La Id de producto ingresada no es válida"})
      return
    }
    else if(cartId.trim().length!=24){
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }
    const productExist = await productRepository.getIdProducts(productId)
    const cartExist = await cartRepository.getIdCarts(cartId)
  
    if(productExist==null){
      res.status(400).send({error:"No existe un producto con la Id ingresada"})
      return
    }
   else if(cartExist==null){
      res.status(400).send({error:"No existe un Cart con la Id ingresada"})
      return
    }
  
    // Comprobación de que el producto exista en el carrito
    let productExistInCart = cartExist.products.find((product)=>product.product._id == productId)
    if(productExistInCart == undefined){
    res.status(400).send({error:"No existe un producto en el carrito con la Id ingresada"})
    return
  }
  
    //Si se comprueba la validez de los parámetros se ejecutan las acciones para actualizar product quantity
    await cartRepository.updateQuantityCarts(cartId,productId,newQuantity)
    response = cartExist
    res.status(200).send({status:'success', message:'El producto se ha actualizado exitósamente', payload:response})
    }
    catch(err){
      res.status(500).send(err.message);
    }
}

const purchase = async (req, res) => {
  try {
    let buyData = req.body
    let ticket = await cartRepository.purchaseCarts(buyData)
    res.json({status:"success", message:"Compra finalizada con éxito", payload:ticket})//purchase);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export{
    getCarts,
    getCartId,
    createCart,
    deleteCartId,
    addItemToCart,
    deleteItemFromCart,
    cartUpdate,
    cartUpdateProduct,
    cartUpdateArray,
    purchase
}