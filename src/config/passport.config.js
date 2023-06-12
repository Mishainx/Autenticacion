import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../config/utils.js";
import GitHubStrategy from 'passport-github2'
const LocalStrategy = local.Strategy;
import config from "../config/config.js"
import { Users } from "../dao/persistence.js";
import UserRepository from "../repository/user.repository.js";
import { Carts } from "../dao/persistence.js";
import CartRepository from "../repository/cart.repository.js";
const carts = new Carts()
const cartRepository = new CartRepository(carts)

const users = new Users()
const userRepository = new UserRepository(users)

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
          let user = await userRepository.getOneUsers({ email: email });
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
            cart: await cartRepository.createCarts()
          };
          let result = await userRepository.create(newUser);
          return done(null, result);
        } catch (err) {
          req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al registrar el usuario`)
          return done("Error al registrar el usuario", false);
        }
      }
    )
  );

  //Estrategia Login
  passport.use("login", new LocalStrategy({usernameField:'email'},async(username,password,done)=>{
    let user = await userRepository.getOneUsers({email:username})
    try{
        if(!user){
            console.log("El usuario no existe")
            return done (null,false,{message:"El usuario no existe"})
        }
    if(!isValidPassword(password,user.password))return done(null,false, {message:"Credenciales inválidas"});
        return done(null,user)
    }
    catch(error){
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al loguear el usuario`)
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
      let user = await userRepository.getOneUsers({email:profile._json.email})
      if(!user){
        console.log(profile)
        let newUser ={
          first_name: profile.username,
          last_name: profile._json.last_name? null : profile._json.last_name,
          age: 18,
          email: profile._json.email,
          password: "",
          cart: await cartRepository.createCarts()
        }
        let result = await userRepository.create(newUser);
        done(null,result);
      }
      else{
        done(null,user);
      }
    }
    catch(error){
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
      return done(error);
    }
  }))
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await userRepository.getIdUsers(id);
    done(null, user);
  } catch (err) {
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()} - Error al deserializar`)
    done(err, null);
  }
});
export default initializePassport;