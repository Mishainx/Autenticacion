import { isValidId } from "../config/utils.js";
import { Users } from "../dao/persistence.js";
import UserRepository from "../repository/user.repository.js";
let users = new Users()
let userRepository = new UserRepository(users)

const upgradeUser = async(req,res)=>{
    const id = req.params.uid

    //Comprobación de validez de la id
    if(id.trim().length!=24){ 
        res.status(404).json({status:"error", message:"La Id ingresada es inválida"})
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - id inválida`)
        return
    }
    
    //Comprobación de la existencia del usuario
    let userExist = await userRepository.getIdUsers(id)
    if(!userExist){
        res.status(404).json({status:"error", message:"Usuario inexistente"})
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Usuario inexistente`)
        return 
    }

    //Comprobación de rol del usuario
    if(userExist.role == "Admin"){
        res.status(400).json({status:"error", message:"El usuario es Admin, no es posible realizar el cambio de rol"})
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - No es posible cambiar de rol un admin`)
        return
    }

    //Acciones para realizar el upgrade del usuario
    if(userExist.role == "Premium"){
        await userRepository.updatePropertyUsers(id,{role:"User"})
        let result = await userRepository.getIdUsers(id)
        req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - ${result.email} nuevo rol: ${result.role}`)
        res.status(200).json({status:"success", payload: result})
    }
    else{
        await userRepository.updatePropertyUsers(id,{role:"Premium"})
        let result = await userRepository.getIdUsers(id)
        req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - ${result.email} nuevo rol: ${result.role}`)
        res.status(200).json({status:"success", payload: result})
    }
}

export{
    upgradeUser
}