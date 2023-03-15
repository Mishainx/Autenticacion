import { Router } from "express";
const sessionsRouter = Router();
import passport from "passport";


sessionsRouter.post("/signup", passport.authenticate('register',{failureRedirect:'/failregister'}),async(req,res)=>{
  res.send({status:"success", message:"Usuario registrado exitosamente"})
})


sessionsRouter.post("/login", passport.authenticate('login',{failureRedirect:"/faillogin"}), async(req,res)=>{
  if(!req.user) return res.status(400).send({status:"error", error: "Credenciales inválidas"})
  req.session.user ={
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role
  }
  res.send({status:"success", payload:req.session.user})
})

sessionsRouter.get('/current',async(req,res)=>{
  let user = req.session.user
  if(user){
  return   res.send(req.session.user)
  }
  else{
    res.status(401).send({status:"error", message: "No hay una sesión iniciada"})
  }
})

export default sessionsRouter;