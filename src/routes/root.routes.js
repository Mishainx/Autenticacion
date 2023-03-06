import { Router } from "express";
import userModel from "../data/models/user.model.js";
const rootRouter = Router();
let noNav = true
import { auth } from "./views.routes.js";
import passport from "passport";

// La ruta /login (get) renderiza la vista login a partir de la cual es posible iniciar la sesión al usuario
rootRouter.get("/login",isLog, async (req,res)=>{
   try{
        res.status(200).render("login",{title:"login",styleSheets:'css/styles', noNav })
    }
   catch(err){
    throw err
   }
})

rootRouter.post('/login',passport.authenticate('login',{failureRedirect:'faillogin'}),async(req,res)=>{
  if(!req.user) return res.status(400).send({status:"error", error: "Credenciales inválidas"})
     req.session.user ={
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    admin: req.user.email == "adminCoder@coder.com"? req.session.admin = true: req.session.admin = false
  }
  let response = req.session.user
  res.json({message:"success", data: response})
})

// La ruta /signup (get) renderiza la vista para registrar un usuario
 rootRouter.get("/signup",isLog, async (req,res)=>{
  try{
       res.status(200).render("signup",{title:"signup",styleSheets:'css/styles', noNav })
   }
  catch(err){
   throw err
  }
})

rootRouter.post("/signup", passport.authenticate('register',{failureRedirect:'/failregister'}),async(req,res)=>{
  res.send({status:"success", message:"Usuario registrado exitosamente"})
})

rootRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{})

rootRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async(req,res)=>{
  console.log(req.user)
  req.session.user = req.user;
  res.redirect('/api/views/products')
})

// La ruta /profile (get) permite visualizar el perfil de un usuario con sesión activa
rootRouter.get("/profile",auth,async (req,res)=>{
  try{

    let findUser = await userModel.findOne({email:req.session.user.email})
    let user ={
      email: req.session.user.email,
      rol: req.session.admin? "Admin": "User",
      name: findUser.first_name,
      surname: findUser.last_name,
      age: findUser.age
    }

       res.status(200).render("profile",{title:"profile",styleSheets:'css/styles', user })
   }
  catch(err){
   throw err
  }
})

// La ruta /logout (get) permite cerrar la sesión
rootRouter.get("/logout",(req,res)=>{
  req.session.destroy(err=>{
    if(err){
      res.send({status:'error', message:'Error al cerrar la sesión: '+err});
    }
    else{
      res.clearCookie('connect.sid',{ path: '/' }).send({status:"success", message: "Sesión cerrada"})
    }
  })
})    

rootRouter.get('/failregister',async(req,res)=>{
  console.log("Failed Strategy")
  res.send({error:"Failed"})
})

rootRouter.get('/failLogin',async(req,res)=>{
  console.log("Failed Login Strategy")
  res.send({error:"Failed"})
})

rootRouter.get('*',(req,res)=>{
    res.status(301).redirect('/api/views/home')
})

// La función isLog redirecciona al usuario a la vista de products en caso de que la sesión esté activa impidiendo que se registre o logué nuevamente
function isLog(req,res,next){
  if(req.session?.user == undefined){
    return next()
  }
  return res.status(401).redirect("/api/views/products")
}

export default rootRouter;


//Rutas viejas

/*

// La ruta /login (post) permite iniciar la sesión al usuario
rootRouter.post("/login",async (req,res)=>{
  const { email, password } = req.body;
  let expReg= /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
  let validateEmail =expReg.test(email)

  //Comprobación de que haya email
  if(email == undefined){
  res.status(400).send({status:"error", message: "Para loguearse debe indicar el email de usuario"})
  return
  }

    if(!validateEmail){
        res.status(400).send({status:"error", message:"Ingrese un email válido"})
        return
    }

    //Comprobación de que el password no esté vacío
    if(password.length == 0){
        res.status(400).send({status:"error", message:"El campo password se encuentra vacío"})
        return
    }
  try {
      const response = await userModel.findOne({
        email: email,
      });

      let checkPass = isValidPassword(password, response.password)
      console.log(checkPass)

      if (response) {
        req.session.user = email
        if(email == "adminCoder@coder.com"){
          req.session.admin = true
        }
        else{
          req.session.admin = false
        }     
        res.status(200).json({ message: "success", data: response });
      } else {
        res.status(404).json({ message: "error", data: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

// La ruta /signup (post) registra un usuario
rootRouter.post("/signup", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  let expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  let validateEmail =expReg.test(email)
  let expRegName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/
  let validateName =  expRegName.test(first_name)
  let validateSurname = expRegName.test(last_name)
  let expRegAge = /^\d{1,2}$/
  let validateAge = expRegAge.test(age)

  //comprobación de campos
  if(first_name == "" || last_name == "" || email == "" || age == "" || password == ""){
    res.status(400).send({ status: "error", message: "Todos los campos deben ser completados"});
    return
  }

  //Comprobación de la estructura y validez del campo email
  if(email == undefined){
    res.status(400).send({status:"error", message:"Para loguearse debe indicar el email de usuario"})
    return
}

if(!validateEmail){
  res.status(400).send({status:"error", message:"Ingrese un email válido"})
  return
}

//Comprobación de la estructura y validez del campo name
if(!validateName){
  res.status(400).send({status:"error", message:"Ingrese un nombre válido"})
  return
}

//Comprobación de la estructura y validez del campo last_name
if(!validateSurname){
  res.status(400).send({status:"error", message:"Ingrese un apellido válido"})
  return
}

//Comprobación de la estructura y validez del campo age
if(!validateAge){
  res.status(400).send({status:"error", message:"Ingrese una edad válida entre 1 y 99 años"})
  return
}

  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password,
  };

  try {

    //Comprobación de que el email no haya sido registrado
    let findUser = await userModel.findOne({email:email})

    if (findUser){
      res.send({ status: "error", message: "El usuario ya existe"});
      return
    }

    const userCreate = await userModel.create(newUser);
    res.send({ status: "success", message:"Usuario creado exitósamente"});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

*/