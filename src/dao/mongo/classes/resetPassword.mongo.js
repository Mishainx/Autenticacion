import resetPasswordModel from "../models/resetPassword.model.js";

export default class ResetPasswordManager{
    constructor(){}

create = async(request)=>{
    try{
        let newRequest =  new resetPasswordModel(request)
        await newRequest.save()
        return newRequest
    }
    catch (err) {
        throw err;
    }   
}

getOne = async(token)=>{
    try {
        let result = await resetPasswordModel.findOne(token)
        return result
    }
    catch (err) {
        throw err;
    }
}

tokenUpdate = async(token)=>{
    try {
        let result = await resetPasswordModel.findOneAndUpdate({token:token},{status:false})
        return result
    }
    catch (err) {
        throw err;
    }
}
}