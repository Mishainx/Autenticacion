let noNav = true
import { Users } from "../dao/persistence.js";
import UserRepository from "../repository/user.repository.js";
let users = new Users()
let userRepository = new UserRepository(users)
import CurrentDTO from "../dto/current.dto.js";
import ResetPasswordManager from "../dao/mongo/classes/resetPassword.mongo.js";
const resetPasswordManager = new ResetPasswordManager()
import ResetPasswordRepository from "../repository/resetPassword.repository.js";
const resetPasswordRepository = new ResetPasswordRepository(resetPasswordManager)
import crypto from "crypto"
import { resetMail } from "./mail.controllers.js";
import { createHash } from "../config/utils.js";
import { isValidPassword } from "../config/utils.js";
export let assignedCart


const getLogin = async (req,res)=>{
    try{
        res.status(200).render("login",{title:"login", noNav })
    }
    catch(err){
        throw err
    }
}

const postLogin = async(req,res)=>{
    if(!req.user) return res.status(400).send({status:"error", error: "Credenciales inválidas"})
        req.session.user ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        cart:  req.user.cart,
        role: req.user.role
    }
    let response = req.session.user
    assignedCart = req.session.user.cart
    let loginTime = new Date()
    userRepository.updatePropertyUsers(req.user._id, {last_connection: loginTime})
    req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleString()} - Loggin exitoso`)
    res.json({message:"success", data: response})
}

const resetPassword = async(req,res)=>{
    try{
    res.status(200).render("resetPassword", {title:"Reset Password", noNav })
    }
    catch(error){
        throw(error)
    }
}

// Controlador para generar el request de reset y enviar el email con el link de activación
const createToken = async(req,res)=>{
    try{
        const {user} = req.body

        let findUser = await userRepository.getOneUsers({email:user})

        if(!!!findUser){
            res.status(404).json({message:"error"})
        }

        else{
            const token = crypto.randomBytes(20).toString("hex")

            let resetRequest={
                email: user,
                token: token,
                expiration: Date.now() + 3600000,
                host: req.headers.host
            }

            let result = await resetPasswordRepository.createReset(resetRequest)
            await resetMail(resetRequest)

            req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Reset password token request: \n ${result.email}`)
            res.status(200).json({message:"success", payload:result})
        }

    }
    catch(error){
        throw(error)
    }
}

const newPassword = async(req,res)=>{
    try{
        let token = req.params.token
        let tokenExist = await resetPasswordRepository.getOneToken({token:token})
        res.status(200).render("newPassword",{title: "newPassword", noNav})
    }
    catch(error){
        throw error
    }
}

const createPassword = async(req,res)=>{
    try{
        const token = req.params.token
        const {password1} = req.body
        let userToken = await resetPasswordRepository.getOneToken({token:token})
        let user = await userRepository.getOneUsers({email:userToken.email})
        
        if(isValidPassword(password1,user.password)){
            res.json({status:"error", message: "La contraseña no puede ser igual a la anterior"})
        return
        }

        if(userToken.status == false){
        res.json({status:"error", message:"Token inválido"})
        return    
        }

        let updateUser = await userRepository.updatePropertyUsers(user._id,{password:createHash(password1)})
        await resetPasswordRepository.tokenUpdate(token)
        
        req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - contraseña actualizada para el usuario ${userToken.email} `)
        res.json({status:"success", message:"Contraseña actualizada"})
    }
    catch(error){
        throw error
    }
}

const getSignUp = async (req,res)=>{
    try{
        res.status(200).render("signup",{title:"signup",styleSheets:'css/styles', noNav })
    }
    catch(err){
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
    throw err
    }
}

const postSignUp = async(req,res,next)=>{
    try{
    req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Registro de usuario exitoso`)
    res.send({status:"success", message:"Usuario registrado exitosamente"})
    }
    catch(error){
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
        next(error)
    }
}

const getGitHub = async(req,res)=>{}

const getGitHubCallback = async(req,res)=>{
    req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Github loggin`)
    req.session.user = req.user;
    console.log(req.session.user)
    res.redirect('/api/views/products')
}


const getProfile = async (req,res)=>{
    try{
        let findUser = await userRepository.getOneUsers({email:req.session.user.email})
        let user ={
        email: req.session.user.email,
        role: findUser.role,
        name: findUser.first_name,
        surname: findUser.last_name,
        age: findUser.age
    }
    res.status(200).render("profile",{title:"profile",styleSheets:'css/styles', user })
    }
    catch(err){
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
    throw err
    }
}

const getCurrent = async(req,res)=>{
    let user = new CurrentDTO(req.session.user)
    if(user){
        return  res.send(user)
    }
    else{
        res.status(401).send({status:"error", message: "No hay una sesión iniciada"})
    }
}

const getLogout = async (req,res)=>{
    try{
        req.session.destroy(err=>{
            if(err){
                res.send({status:'error', message:'Error al cerrar la sesión: '+err});
            }
            else{
                let loginTime = new Date()
                userRepository.updatePropertyUsers(req.user._id, {last_connection: loginTime})
                req.logger.info(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Sesión destruida`)
                res.clearCookie('connect.sid',{ path: '/' }).send({status:"success", message: "Sesión cerrada"})
            }
        })
    }
    catch(error){
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
        throw error
    }
}

const getFailRegister = async(req,res)=>{
    let errorFlash = req.flash()
    let message = errorFlash.error?errorFlash.error[0]: "Para registrar un usuario todos los campos deben estar completos"
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Failed  register Strategy`)
    res.send({status:"error", message})
}

const getFailLogin = async(req,res)=>{
    let errorFlash = req.flash()
    let message = errorFlash.error?errorFlash.error[0]: "Ingrese usuario y contraseña"
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Failed Loggin Strategy`)
    res.send({status:"error", message})
}

const getNoFound = async (req,res)=>{
    try{
        res.status(301).redirect('/api/views/home')
    }
    catch(error){
        req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
        throw error
    }
}

export {
    getLogin,
    postLogin,
    resetPassword,
    getSignUp,
    postSignUp,
    getGitHub,
    getGitHubCallback,
    getProfile,
    getCurrent,
    getLogout,
    getFailRegister,
    getFailLogin,
    getNoFound,
    createToken,
    newPassword,
    createPassword
}