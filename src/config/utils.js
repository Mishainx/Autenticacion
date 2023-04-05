import { fileURLToPath } from 'url';
import { dirname } from 'path';
const _filename = fileURLToPath(import.meta.url);
const __filename = _filename.slice(0,-15)
export const __dirname = dirname(__filename);
import bcrypt from 'bcrypt'


//Funciones de haseo con Bcrypt
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user);

  // La función isLog redirecciona al usuario a la vista de products en caso de que la sesión esté activa impidiendo que se registre o logué nuevamente
  export const isLog = (req,res,next)=>{
  if(req.session?.user == undefined){
    return next()
  }
  return res.status(401).redirect("/api/views/products")
}

export const auth = async (req,res,next)=>{
    if(req.session?.user != undefined){
      return next()
    }
    return res.status(401).redirect("/login")
}

export const checkRole =(role)=>{
  return async(req,res,next)=>{
    console.log(req.session.user.role)
    console.log(role)
    if(role == req.session.user.role){
      return next()
    }
    return res.status(403).send("credenciales insuficientes")
  }
} 



  