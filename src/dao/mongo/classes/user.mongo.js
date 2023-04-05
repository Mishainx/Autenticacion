import userModel from "../models/user.model.js";

export default class UserManager{
    constructor(){}

    get = async()=>{
        try{
            return await userModel.find();
        }
        catch (err) {
            throw err;
        }
    }

    getId = async(userId)=>{
        try {
            const selectedUser = await userModel.findById(userId)
            return selectedUser
        }
        catch (err) {
            throw err;
        }
    }

    getOne = async(prop)=>{
        try {
            const selectedUser = await userModel.findOne(prop)
            return selectedUser
        }
        catch (err) {
            throw err;
        }
    }
    
    create = async(user)=>{
        try{
            const newUser = new userModel(user);
            await newUser.save();
            return newUser;
        }
        catch (err) {
            throw err;
        }   
    } 
    
    delete = async(userId)=>{
        try {
            const result = await userModel.findByIdAndDelete(cartId);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}