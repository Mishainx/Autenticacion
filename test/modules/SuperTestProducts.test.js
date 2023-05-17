import chai from "chai";
import supertest from "supertest";
import config from "../../src/config/config.js";
const expect = chai.expect
const requester = supertest(`http://0.0.0.0:8080`)
let cookie;
let productId

export const productsTest = () =>{

    describe("Testing products",()=>{
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
            it("El endpoint GET /api/products debe traer todos los productos en formato array",async()=>{
            const{
                statusCode,
                ok,
                _body
            } = await requester.get("/api/products")
            expect(Array.isArray(_body.payload)).to.be.equal(true)
            })
            it("El endpoint POST /api/products debe crear un producto en la base de datos",async()=>{
    
                let productMock = {
                    title: "kiwiTest",
                    description: "kiwiTest por KG",
                    price: 400,
                    thumbnail: [],
                    code: "kiwi1",
                    stock: 10,
                    category: "fruta",
                    status: true
                }
    
                const{
                    headers,
                    statusCode,
                    ok,
                    _body,
                } = await requester.post("/api/products").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(productMock)
                productId = _body.response._id
                expect(statusCode).to.be.deep.equal(200)
        })
            it("El endpoint PUT /api/products/:pid debe modificar las propiedades de un producto",async()=>{

                const updateMock={
                stock: 777
                }
            
                const{
                    headers,
                    statusCode,
                    ok,
                    _body,
                } = await requester.put(`/api/products/${productId}`).set("Cookie", [`${cookie.name}=${cookie.value}`]).send(updateMock)
                expect(_body.response.stock).to.be.deep.equal(777)
        })
            it("El endpoint DELETE /api/products/:pid debe eliminar un producto de la base de datos",async()=>{
        

            const{
                headers,
                statusCode,
                ok,
                _body,
            } = await requester.delete(`/api/products/${productId}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(statusCode).to.be.deep.equal(200)
        })
    })
}