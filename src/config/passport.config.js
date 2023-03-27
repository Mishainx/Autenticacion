import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../config/utils.js";
import userModel from "../dao/mongo/models/user.model.js";
import GitHubStrategy from 'passport-github2'
const LocalStrategy = local.Strategy;
import { CartManager } from "../dao/mongo/DBManager.js";
const cartManager = new CartManager();
import config from "../config/config.js"

const initializePassport = () => {
  
  //Estrategia register
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
    async (req, email, password, done) => {
        
    const { first_name, last_name, age } = req.body;

  let expReg= /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
  let validateEmail =expReg.test(email)
  let expRegName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/
  let validateName =  expRegName.test(first_name)
  let validateSurname = expRegName.test(last_name)
  let expRegAge = /^\d{1,2}$/
  let validateAge = expRegAge.test(age)

  //comprobación de campos
  if(!!!first_name || !!!last_name || !!!email || !!!age || !!!password){
    console.log("todos los campos deben ser completados")
    return done(null,false,{message:"Todos los campos deben ser completados"})
  }

  //Comprobación de la estructura y validez del campo email
  if(email == undefined){
    console.log("email inválido")
    return done(null,false,{message:"Ingrese un email válido"})
}

if(!validateEmail){
    console.log("email inválido")
    return done(null,false,{message:"Ingrese un email válido"})
}

//Comprobación de la estructura y validez del campo name
if(!validateName){
    console.log("Nombre inválido")
    return done(null,false,{message:"Ingrese un nombre válido"})
}

//Comprobación de la estructura y validez del campo last_name
if(!validateSurname){
    console.log("Apellido inválido")
    return done(null,false,{message:"Ingrese un apellido válido"})
}

//Comprobación de la estructura y validez del campo age
if(!validateAge){
  console.log("Edad inválida")
  return done(null,false,{message:"Ingrese una edad válida entre 1 y 99 años"})
}
        try {
          let tutu = await cartManager.create()
          let user = await userModel.findOne({ email: email });
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false,{message: "El usuario ya existe"});
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: email == "adminCoder@coder.com"? "Admin": "User",
            cart: await cartManager.create()
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done("Error al registrar el usuario", false);
        }
      }
    )
  );

  //Estrategia Login
  passport.use("login", new LocalStrategy({usernameField:'email'},async(username,password,done)=>{
    try{
        const user = await userModel.findOne({email:username})
        if(!user){
            console.log("El usuario no existe")
            return done (null,false,{message:"El usuario no existe"})
        }
        if(!isValidPassword(password,user.password))return done(null,false, {message:"Credenciales inválidas"});
        return done(null,user)
    }
    catch(error){
        return done(error)
    }
  }))

  //Estrategia Github
  passport.use('github', new GitHubStrategy({
    clientID: config.CLIENT_ID_GITHUB,
    clientSecret: config.CLIENT_SECRET_GITHUB,
    callBackURL: config.CALLBACK_URL_GITHUB
  },async(accessToken,refreshToken,profile,done)=>{
    try{
      console.log(profile._json)
      let user = await userModel.findOne({email:profile._json.email})
      if(!user){
        let newUser ={
          first_name: profile._json.login,
          last_name: profile._json.last_name? null : profile._json.last_name,
          age: 18,
          email: profile._json.email,
          password: "",
          cart: await cartManager.create()
        }
        let result = await userModel.create(newUser);
        done(null,result);
      }
      else{
        done(null,user);
      }
    }
    catch(error){
      return done(error);
    }
  }))
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default initializePassport;
