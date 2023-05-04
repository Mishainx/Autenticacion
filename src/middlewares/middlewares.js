import { isTokenExpired } from "../config/utils.js"
import resetPasswordModel from "../dao/mongo/models/resetPassword.model.js"

  export const isLog = (req,res,next)=>{
    if(req.session?.user == undefined){
      return next()
    }
    return res.status(401).redirect("/api/views/products")
  }
  
  export const auth= async (req,res,next)=>{
      if(req.session?.user != undefined){
        return next()
      }
      req.logger.warning(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Usuario sin autenticar`)
      return res.status(401).redirect("/login")
  }

  export const authPostman= async (req,res,next)=>{
    if(req.session?.user != undefined){
      return next()
    }
    req.logger.warning(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Usuario sin autenticar`)
    return res.status(401).json({status:"Error", message:"Usuario sin auntenticar"})
}
  
  export const checkRole =(role)=>{
    return async(req,res,next)=>{

      if(role.includes(req.session.user.role)){
      req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Rol autorizado`)
      return next()
      }
      let noNav = true
      req.logger.warning(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Rol no autorizado`)
      return res.status(403).render("policies",{noNav })
    }
  }
  
  export const checkRolePostman =(role)=>{
    return async(req,res,next)=>{

      if(role.includes(req.session.user.role)){
      req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Rol autorizado`)
      return next()
      }
      req.logger.warning(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Rol no autorizado`)
      return res.status(403).json({status:"Error", message: "Usuario sin autorización para la acción solicitada"})
    }
  } 

  export const tokenValidation = async (req,res,next) =>{
    try{
      let noNav = true
      let token = req.params.token
      let tokenExist = await resetPasswordModel.findOne({token:token})

      if(!isTokenExpired(tokenExist?.expiration ) || !tokenExist || !tokenExist.status)
      {
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Token inválido`)
        return res.status(403).render("linkExpiration", {title:"Expiration link", noNav })
      }
      next()
    } 
    catch(error){
      throw error
    }
  }