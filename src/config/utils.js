import { fileURLToPath } from 'url';
import { dirname } from 'path';
const _filename = fileURLToPath(import.meta.url);
const __filename = _filename.slice(0,-15)
export const __dirname = dirname(__filename);
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker';
import { Users } from "../dao/persistence.js";
import UserRepository from "../repository/user.repository.js";
let users = new Users()
let userRepository = new UserRepository(users)


//Funciones de haseo con Bcrypt
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user);

//Configuración faker
faker.locale = "es"

export const generateProduct = ()=>{

  return{
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.datatype.uuid(),
    price: parseInt(faker.commerce.price(0,1500)),
    thumbnail:[],
    stock: faker.datatype.number({max:2000}),
    category: faker.commerce.productAdjective(),
    status:true
  }
}

export const isTokenExpired = (date) =>{
  let actualTime = new Date(Date.now())
  console.log(date)

  if(date>actualTime){
    return true
  }
  else{
    return false
  }
}

//Comprabaciones
export const isValidId = async(id) => {
  if(id.trim().length!=24){ 
  console.log("asdasdasd")
  return true
  }
  let userExist = await userRepository.getIdUsers(id)
  console.log(userExist)
  if(!userExist){
    return false
  }
}

