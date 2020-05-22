const supertest = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js")

let key = "";

beforeAll(async ()=> {
    await db("users").truncate();
    key = "";
})

describe("server", ()=>{
    it("can run the tests", ()=>{
        expect(true).toBeTruthy();
    })
    describe("GET /", ()=>{
        it("should return status code 200", ()=>{
            return supertest(server).get('/').then(res=>{
                expect(res.status).toBe(200);
            })
        })
        it("should return {api: up}", ()=>{
            return supertest(server).get('/').then(res=>{
                expect(res.body.api).toBe("up");
            })
        })
    })
})

describe("auth", ()=>{
    describe("POST /api/register", ()=>{
        it("should return status code 201 on successful account creation", ()=>{
            const newUser = {id: 1, username: "LambdaSchool", password: "ThIsIsMyPa$sW0Rd"}
            return supertest(server).post("/api/auth/register").send(newUser).then(res=>{
                expect(res.status).toBe(201);
            })
        })
        it("should return status code 400 on missing required info", ()=>{
            const newUser = {id: 2, username:"LambdaSkool", password: ""}
            return supertest(server).post("/api/auth/register").send(newUser).then(res=>{
                expect(res.status).toBe(400)
            })
        })
    })
    describe("POST /api/login", ()=>{
        it("should return status code 200 on successful login", ()=>{
            const newUser = {username: "LambdaSchool", password: "ThIsIsMyPa$sW0Rd"}
            return supertest(server).post('/api/auth/login').send(newUser).then(res=>{
                key = res.body.token;
                expect(res.status).toBe(200);
            })
        })
        it("should return status code 401 if incorrect password", ()=>{
            const newUser = {username: "LambdaSchool", password: "imahackerlookatme"}
            return supertest(server).post('/api/auth/login').send(newUser).then(res=>{
                expect(res.status).toBe(401);
            })
        })
    })
    describe("GET /api/jokes (unauthorized)", ()=>{
        it("should return status code 400 if not authorized", ()=>{
            return supertest(server).get('/api/jokes').then(res=>{
                expect(res.status).toBe(400);
            })
        })
        it("should return status code 200 if authorized", ()=>{
            return supertest(server).get("/api/jokes").set({"authorization": key}).then(res=>{
                expect(res.status).toBe(200);
            })
        })
        it("should return dad joke array if authorized", ()=>{
            return supertest(server).get("/api/jokes").set({"authorization": key}).then(res=>{
                expect(Array.isArray(res.body)).toBe(true);
            })
        })
    })
})