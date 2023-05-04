export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }

    getUsers = async()=>{
        const result = await this.dao.get()
        return result
    }

    getIdUsers = async(id)=>{
        const result = await this.dao.getId(id)
        return result
    }

    getOneUsers = async(prop)=>{
        const result = await this.dao.getOne(prop)
        return result
    }

    create = async(user)=>{
        const result = await this.dao.create(user)
        return result
    }

    delete = async(id)=>{
        const result = await this.dao.delete(id)
        return result
    }

    updatePropertyUsers = async(id,property)=>{
        const result = await this.dao.updateProperty(id,property)
        return result
    }
}