import { messageModel } from "../models/messages.model.js";

export default class MessageManager{

    get = async()=> {
        try {
            const messages = await messageModel.find();
            return messages;
        } 
        catch (err) {
            throw err;
        }
    }

    create = async(message)=>{
        try {
            let newMessage={
                name:message[0].user,
                message:message[0].message,
                status:true
            }
            let result= await messageModel.create(newMessage)
            return result
        } 
        catch (err) {
            throw err;
        }
    }
    
    delete = async(messageId)=>{
        try {
          const result = await messageModel.findByIdAndDelete(messageId);
          return result;
        } 
        catch (err){
          throw err;
        }
    }    
}