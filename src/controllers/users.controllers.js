import { Users } from "../dao/persistence.js";
import UserRepository from "../repository/user.repository.js";
let users = new Users()
let userRepository = new UserRepository(users)

const upgradeUser = async(req,res)=>{
    try{
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

            if(userExist.documents.length<1){
                res.status(400).json({status:"error", message:"El usuario no ha sido subido los documentos suficientes"})
                req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - documentos insuficientes para upgrade premium`)
                return
            }

            const identificationDoc = userExist.documents.some((file)=>file.name == "identification")
            const accountDoc = userExist.documents.some((file)=>file.name == "account")
            const residenceDoc = userExist.documents.some((file)=>file.name == "residence")

            if(identificationDoc && accountDoc && residenceDoc){
                await userRepository.updatePropertyUsers(id,{role:"Premium"})
                let result = await userRepository.getIdUsers(id)
                req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - ${result.email} nuevo rol: ${result.role}`)
                res.status(200).json({status:"success", payload: result})
            }
            else{
                res.status(400).json({status:"error", message:"El usuario no ha sido subido los documentos suficientes"})
                req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - documentos insuficientes para upgrade premium`)
                return
            }
        }
    }
    catch(error){
        throw error
    }
}

const deleteUser = async(req,res)=>{
    try{
        let id = req.params.uid

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

        // Si la Id es válida se procede a eliminar el usuario
        let result = await userRepository.delete(id)
        req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Usuario eliminado exitosamente`)
        res.status(200).json({status:"success", payload:`Usuario ${id} eliminado exitosamente` })
    }
    catch(error){
        throw error
    }
}

// uploadDocuments permite subir uno o varios documentos
const uploadDocuments = async (req,res)=>{
    const uid = req.user._id
    const profiles = req.files?.profiles? req.files.profiles:[]
    const documents = req.files?.documents? req.files.documents:[]
    const products = req.files?.products? req.files.products:[]
    const identification = req.files?.identification? req.files.identification:[]
    const account = req.files?.account? req.files.account:[]
    const residence = req.files?.residence? req.files?.residence:[]

    let filesArray = [...profiles,...products,...documents,...identification,...account,...residence]
    let user = await userRepository.getIdUsers(uid)

    if(filesArray.length>0){
        console.log(req.files)
        filesArray.forEach(file => {
            file={
                name: file.fieldname,
                reference: file.path
            }
            user.documents.push(file)
        });
        user.save()
        res.status(200).json({status:"success", message: "Documentos subidos exitosamente"})
    }
    else{
        res.status(400).json({status:"error", message: "No hay documentos válidos para subir"})
    }
}


export{
    upgradeUser,
    deleteUser,
    uploadDocuments
}