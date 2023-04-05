export default class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    getProducts = async()=>{
        let result = await this.dao.get()
        return result
    }

    getIdProducts = async(id)=>{
        let result = await this.dao.getId(id)
        return result
    }

    getOneProducts = async(prop)=>{
        let result = await this.dao.getOne(prop)
        return result
    }

    createProducts = async(product)=>{
        let result = await this.dao.create(product)
        return result
    }

    deleteProducts = async(productId)=>{
        let result = await this.dao.delete(productId)
        return result
    }

    updateProducts = async(productId, productProperty)=>{
        let result = await this.dao.update(productId, productProperty)
        return result
    }

    findCodeProducts = async(itemCode)=>{
        let result = await this.dao.findCode(itemCode)
        return result
    }

    getPaginateProducts = async(category,stockQuery,limit,page,sort)=>{
        let result = await this.dao.getPaginate(category,stockQuery,limit,page,sort)
        return result
    }

    propProducts = async(prop)=>{
        let result = await this.dao.prop(prop)
        return result
    }
}