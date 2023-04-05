export default class CartRepository{
    constructor(dao){
        this.dao = dao;
    }

    getCarts = async()=>{
        try{
            let result = await this.dao.get()
            return result
        }
        catch (err) {
            throw err;
        }
    }

    getIdCarts = async(id)=>{
        try{
            let result = await this.dao.getId(id)
            return result
        }
        catch (err) {
            throw err;
        }
    }

    getOneCarts = async(prop)=>{
        try{
            let result = await this.dao.getOne(prop)
            return result
        }
        catch (err) {
            throw err;
        }
    }

    createCarts = async()=>{
        try{
            let result = await this.dao.create()
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    deleteCarts = async(id)=>{
        try{
            let result = await this.dao.delete(id)
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    updateCarts = async(cartId, productId, quantity)=>{
        try{
            let result = await this.dao.update(cartId, productId, quantity)
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    updateQuantityCarts= async(cartId, productId, quantity)=>{
        try{
            let result = await this.dao.updateQuantity(cartId, productId, quantity)
            return result;
        }
        catch (err) {
            throw err;
        }

    }

    updateArrayCarts = async(cartId, array)=>{
        try{
            let result = await this.dao.updateArray(cartId, array)
            return result
        }
        catch (err) {
            throw err;
        }
    }

    addItemCarts = async(cartId, productId, quantity)=>{
        try{
            let result = await this.dao.addItem(cartId, productId, quantity)
            return result
        }
        catch (err) {
            throw err;
        }
    }

    deleteProductCarts = async(cartId,productId)=>{
        try{
            let result = await this.dao.deleteProduct(cartId,productId)
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    deleteAllCarts = async(cartId)=>{
        try{
            let result = await this.dao.deleteAll(cartId)
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    purchaseCarts = async(buyData)=>{
        try{
            let result = await this.dao.purchase(buyData)
            
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}