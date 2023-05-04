export default class ResetPasswordRepository{
    constructor(dao){
        this.dao = dao;
    }

    createReset = async(data)=>{
        const result = await this.dao.create(data)
        return result
    }

    getOneToken = async(token)=>{
        const result = await this.dao.getOne(token)
        return result
    }

    tokenUpdate = async(token)=>{
        const result = await this.dao.tokenUpdate(token)
        return result
    }
}