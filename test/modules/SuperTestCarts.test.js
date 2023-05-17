import chai from "chai";
import supertest from "supertest";
import config from "../../src/config/config.js";
const expect = chai.expect
const requester = supertest(`http://0.0.0.0:8080`)
import { Carts } from "../../src/dao/persistence.js";
import CartRepository from "../../src/repository/cart.repository.js";
import ProductRepository from "../../src/repository/product.repository.js";
import { Products } from "../../src/dao/persistence.js";
let products = new Products()
let productsRepository = new ProductRepository(products)

let carts = new Carts()
let cartRepository = new CartRepository(carts)

let cookie
let cartId

export const  cartsTest = () =>{
    describe("Testing Carts",()=>{
        before(async function(){
            let credentials={
            email: config.TEST_USER,
            password: config.TEST_PASSWORD
            }
            const{headers} = await requester.post("/api/sessions/login").send(credentials)
            let cookieResult = headers["set-cookie"][0]
            cookie={
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
        })
        it("El endpoint GET /api/carts debe traer todos los productos en formato array",async()=>{
            const{
                statusCode,
                ok,
                _body
            } = await requester.get("/api/carts")
            expect(Array.isArray(_body)).to.be.equal(true)
            })
        it("El endpoint POST /api/carts debe crear un carrito en la base de datos",async()=>{
                const{
                    statusCode,
                    ok,
                    _body
                } = await requester.post("/api/carts")
                cartId = _body.response._id
                expect(statusCode).to.be.equal(200)
            })
        it("El endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito",async()=>{
                const productQuantity ={
                    quantity: 80
                }

                let anyProduct = await productsRepository.getProducts()
                const{
                    statusCode,
                    ok,
                    _body
                } = await requester.post(`/api/carts/${cartId}/products/${anyProduct[0]._id}`).set("Cookie", [`${cookie.name}=${cookie.value}`]).send(productQuantity)
                expect(statusCode).to.be.equal(200)
            })
        it("El endpoint DELETE /api/carts/:cid debe eliminar un carrito de la base de datos",async()=>{
                const{
                    statusCode,
                    ok,
                    _body
                } = await requester.delete(`/api/carts/delete/${cartId}`)
                expect(statusCode).to.be.equal(200)
            })
        }) 
}
