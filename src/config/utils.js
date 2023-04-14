import { fileURLToPath } from 'url';
import { dirname } from 'path';
const _filename = fileURLToPath(import.meta.url);
const __filename = _filename.slice(0,-15)
export const __dirname = dirname(__filename);
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker';


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