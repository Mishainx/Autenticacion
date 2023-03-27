import { fileURLToPath } from 'url';
import { dirname } from 'path';
const _filename = fileURLToPath(import.meta.url);
const __filename = _filename.slice(0,-15)
export const __dirname = dirname(__filename);
import bcrypt from 'bcrypt'
import passport from 'passport';

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

  export const passportCall = (strategy) =>{
    return async(req,res,next)=>{
      passport.authenticate(strategy,function(err,user,info){
        if(err) return next(err);
        if(!user){
          return res.status(401).send({error:info.message?info.message:info.toString()})
        }
        req.user = user;
        next()
      })(req,res,next)
    }
  }

  export const auth = async (req,res,next)=>{
    if(req.session?.user != undefined){
      return next()
    }
    return res.status(401).redirect("/login")
  }

  