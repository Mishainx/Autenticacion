import {productModel} from "../models/products.model.js";
import userModel from "../models/user.model.js";

export default class ProductManager {

    get = async()=> {
        try {
            const products = await productModel.find().lean();
            return products;
        } 
        catch (err) {
            throw err;
        }
    }
  
    create = async(product)=>{
        try {
          const newProduct = new productModel(product);
          await newProduct.save();
          return newProduct;
        } 
        catch (err) {
            throw err;
        }
    }
  
    getId = async (id)=>{
      try {
        const product = await productModel.findById(id);
        return product;
      }
      catch (err) {
        throw err;
      }
    }

    getOne = async(prop)=>{
        try {
            const selectedProduct = await userModel.findOne(prop)
            return selectedProduct
        }
        catch (err) {
            throw err;
        }
    }

    getPaginate = async(category,stockQuery,limit,page,sort)=>{
        let result = await productModel.paginate({...category,...stockQuery},{lean:true, limit:limit, page:page, sort: {price:sort}})
        return result
    }
  
    delete = async(productId)=>{
      try {
        const result = await productModel.findByIdAndDelete(productId);
        return result;
      } 
      catch (err){
        throw err;
      }
    }

    update = async(productId, productProperty)=>{
      try {
        const newProductProperty = await productModel.findByIdAndUpdate(productId,productProperty)
        return newProductProperty
      } 
      catch (err) {
        throw err;
      }
    }
    
    findCode = async(itemCode)=>{
      try{
        const findCodeResult = await productModel.findOne({code:itemCode})
        return findCodeResult
      }
      catch (err) {
        throw err;
      }
    }

    prop = async(prop)=>{
      try{
        const findProp = await productModel.exists(prop)
        return findProp
      }
      catch (err) {
        throw err;
      }
    }
  }