import chai from "chai";
import supertest from "supertest";
import { Users } from "../../src/dao/persistence.js";
import UserRepository from "../../src/repository/user.repository.js";

const users = new Users()
const userRepository = new UserRepository(users)
const expect = chai.expect
const requester = supertest(`http://0.0.0.0:8080`)
let registeredUser
let cookie;

export const sessionsTest = () =>{
        describe("Test de Sessions",async()=>{
            it("El endpoint POST /api/sessions/signup debe generar error si faltan datos al registrarse", async()=>{
                // userMock sin propiedad requerida email
                let userMock = {
                    first_name: "User",
                    last_name: "Mock",
                    age: 80,
                    password: "usermock",
                    role: "Premium"
                }
    
                const{
                    statusCode
                } = await requester.post("/api/sessions/signup").send(userMock)
                registeredUser = await userRepository.getOneUsers({email:userMock.email})
                expect(statusCode).to.not.be.equal(200)
            })
            it("El endpoint POST /api/sessions/signup debe crear un usuario en la base de datos", async()=>{
                let userMock = {
                    first_name: "User",
                    last_name: "Mock",
                    email: "usermock@usermock.com.ar",
                    age: 80,
                    password: "usermock"
                }
    
                const{
                    statusCode,
                } = await requester.post("/api/sessions/signup").send(userMock)
                registeredUser= await userRepository.getOneUsers({email:userMock.email})
                expect(statusCode).to.be.equal(200)
            })
            it("El endpoint POST /api/login debe generar error si el usuario es inválido", async()=>{
                let loginMock = {
                    email: "undefined",
                    password: "usermock"
                }
                const{
                    ok,
                } = await requester.post("/api/sessions/login").send(loginMock)
                expect(ok).to.not.be.equal(true)
            })
            it("El endpoint POST /api/login debe loguear un usuario y devolver una cookie", async()=>{
                let loginMock = {
                    email: "usermock@usermock.com.ar",
                    password: "usermock"
                }
                const{
                    _body,
                    headers
                } = await requester.post("/api/sessions/login").send(loginMock)
                let cookieResult = headers["set-cookie"][0]
                cookie={
                    name: cookieResult.split("=")[0],
                    value: cookieResult.split("=")[1]
                }
    
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
    
                expect(cookie.name).to.be.ok.and.eql("connect.sid")
                expect(_body.payload.email).to.be.equal(loginMock.email)
            })
            it("El endpoint GET /current debe devolver el usuario almacenado en una cookie", async()=>{
                const{
                    _body,
                } = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
                expect(_body.user).to.be.eql("usermock@usermock.com.ar")
            })
            it("El endpoint GET /logout debe destruir la cookie  de sesión", async()=>{
                await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
                const{
                    statusCode,
                } = await requester.get("/logout")
                expect(statusCode).to.be.eql(200)
            })
            it("El endpoint DELETE /api/users/delete/:uid debe eliminar el usuario de la base de datos", async()=>{
                const{
                    _body
                } = await requester.post(`/api/users/delete/${registeredUser._id}`)
                expect(_body.status).to.be.deep.eql("success");
            })
        })
}