export default class MessageRepository{
    constructor(dao){
        this.dao = dao;
    }

    getMessage = async()=>{
        try{
            let result = await this.dao.get()
            return result
        }
        catch (err) {
            throw err;
        }
    }

    
    CreateMessage = async(message)=>{
        try{
            let result = await this.dao.create(message)
            return result
        }
        catch (err) {
            throw err;
        }
    }

    deleteMessage = async(messageId)=>{
        try{
            let result = await this.dao.delete(messageId)
            return result
        }
        catch (err) {
            throw err;
        }
    }
}