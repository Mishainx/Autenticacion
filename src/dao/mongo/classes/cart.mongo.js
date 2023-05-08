import cartModel from "../models/carts.model.js"
import { productModel } from "../models/products.model.js";
import ticketModel from "../models/tickets.model.js";
import crypto from "crypto"

export default class CartManager {
    constructor(){}

    get = async()=>{
        try{
            return await cartModel.find();
        }
        catch (err) {
            throw err;
        }
    }

    getId = async(cartId)=>{
        try {
            const selectedCart = await cartModel.findById(cartId).lean().populate("products.product")
            return selectedCart
        }
        catch (err) {
            throw err;
        }
    }

    getOne = async(prop)=>{
        try {
            const selectedCart = await cartModel.findOne(prop)
            return selectedCart
        }
        catch (err) {
            throw err;
        }
    }
    
    create = async()=>{
        try{
            const newCart = new cartModel();
            await newCart.save();
            return newCart;
        }
        catch (err) {
            throw err;
        }
    }

    delete = async(cartId)=>{
        try {
            const result = await cartModel.findByIdAndDelete(cartId);
            return result;
          } catch (err) {
            throw err;
          }
    }

    update = async(cartId, productId, quantity)=>{
        const myProduct = {
            id: productId,
            quantity: quantity,
          };
          try {
            const selectedCart = await cartModel.findById(cartId)
            const productExist = await selectedCart.products.find((product)=>product.id==productId)
            if(!productExist){
              selectedCart.products.push(myProduct)
              selectedCart.save()
            }
            else{
            const productIndex = await selectedCart.products.findIndex((product)=>product.id==productId)
            const newQuantity = await selectedCart.products[productIndex].quantity+quantity
            selectedCart.products[productIndex].quantity = newQuantity
            await cartModel.findByIdAndUpdate(cartId,{products: selectedCart.products})
            }
        }    
      
          catch (err) {
            throw err;
          }
    }

    updateQuantity = async(cartId, productId, quantity)=>{
          try {
            const selectedCart = await cartModel.findById(cartId)
            const productIndex = await selectedCart.products.findIndex((product)=>product.product._id==productId)
            selectedCart.products[productIndex].quantity = quantity.quantity
            let productUpdate = await cartModel.findByIdAndUpdate({_id:cartId}, selectedCart)
            let result = await cartModel.findById(cartId)
            return result
        }    
      
          catch (err) {
            throw err;
          }
    }

    updateArray= async(cartId, array)=>{

        try {
            let updateArray = await cartModel.findByIdAndUpdate({_id:cartId},{products:array.products})       
            let result = await cartModel.findById(cartId)
            return result
        }
        catch (err) {
            throw err;
        }
      
    }

    addItem = async(cartId, productId, quantity)=>{
        try{
            let selectedCart = await cartModel.findById(cartId)
            let productExistInCart = selectedCart.products.find((product)=>product.product == productId)

            let myItem={
                quantity:quantity,
                product: productId
            }   

            if(!productExistInCart){        
                selectedCart.products.push(myItem)
                selectedCart.save()
            }
            else{
                myItem.quantity = productExistInCart.quantity + parseInt(quantity)
                let productIndex= selectedCart.products.findIndex((product)=>product.product == productId)
                selectedCart.products[productIndex].quantity = myItem.quantity
                selectedCart.save()
            }
            let response = selectedCart
            return response

        }   
        catch (err) {
            throw err;
        }
    }
    
    deleteProduct = async(cartId,productId)=>{
        try {
            const selectedCart = await cartModel.findById(cartId)
            console.log(selectedCart)
            await cartModel.findByIdAndUpdate(cartId,{products: selectedCart.products.filter((product)=>product.product!=productId)})
            const newCart = await cartModel.findById(cartId)
            return newCart
        }
        catch (err) {
            throw err;
        }
    }

    deleteAll = async(cartId)=>{
        try{            
            const newCart = await cartModel.findByIdAndUpdate({_id:cartId},{products:[]})
            return newCart
        }
        catch (err) {
            throw err;
        }
    }

    purchase = async(buyData)=>{
        try{
            let {user,role,cart} = buyData
            let date = new Date()
            let selectedCart = await cartModel.findById(cart).populate("products.product")
            let totalAmount = 0
            selectedCart.products.forEach(product => {
                totalAmount = totalAmount + (product.product.price*product.quantity)
            });
            let ticketInfo ={
                code:crypto.randomUUID(),
                purchase_datetime: date.toLocaleString(),
                amount:totalAmount,
                purcharser: user,
                products: selectedCart
            }
            
            const newTicket = new ticketModel(ticketInfo);
            await newTicket.save();
            await this.deleteAll(cart)

            return newTicket;
        }
        catch (err) {
            console.log(err)
            throw err;
        }
    }
}