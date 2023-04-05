let noNav = true
import { Users } from "../dao/persistence.js";
import UserRepository from "../repository/user.repository.js";
let users = new Users()
let userRepository = new UserRepository(users)
import CurrentDTO from "../dto/current.dto.js";
export let assignedCart

const getLogin = async (req,res)=>{
    try{
         res.status(200).render("login",{title:"login",styleSheets:'css/styles', noNav })
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
    console.log(response.role)
    res.cookie("coderCookie", req.session.user).json({message:"success", data: response})
}

const getSignUp = async (req,res)=>{
    try{
         res.status(200).render("signup",{title:"signup",styleSheets:'css/styles', noNav })
     }
    catch(err){
     throw err
    }
}

const postSignUp = async(req,res)=>{
    res.send({status:"success", message:"Usuario registrado exitosamente"})
}

const getGitHub = async(req,res)=>{}

const getGitHubCallback = async(req,res)=>{
    console.log(req.user)
    req.session.user = req.user;
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
     throw err
    }
}

const getCurrent = async(req,res)=>{
    let user = new CurrentDTO(req.session.user)
    if(user){
        return   res.send(user)
    }
    else{
        res.status(401).send({status:"error", message: "No hay una sesión iniciada"})
    }
}

const getLogout = async (req,res)=>{
    req.session.destroy(err=>{
      if(err){
        res.send({status:'error', message:'Error al cerrar la sesión: '+err});
      }
      else{
        res.clearCookie('connect.sid',{ path: '/' }).send({status:"success", message: "Sesión cerrada"})
      }
    })
}

const getFailRegister = async(req,res)=>{
    console.log("Failed Strategy")
    let errorFlash = req.flash()
    let message = errorFlash.error?errorFlash.error[0]: "Para registrar un usuario todos los campos deben estar completos"
    res.send({status:"error", message})
}

const getFailLogin = async(req,res)=>{
    let errorFlash = req.flash()
    let message = errorFlash.error?errorFlash.error[0]: "Ingrese usuario y contraseña"
    console.log("Failed Login Strategy")
    res.send({status:"error", message})
}

const getNoFound = async (req,res)=>{
res.status(301).redirect('/api/views/home')
}

export {
    getLogin,
    postLogin,
    getSignUp,
    postSignUp,
    getGitHub,
    getGitHubCallback,
    getProfile,
    getCurrent,
    getLogout,
    getFailRegister,
    getFailLogin,
    getNoFound
}