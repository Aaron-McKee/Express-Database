
process.env.NODE_ENV = 'test';          //this must be stated before require ('../db')
const request = require('supertest');
const app = require ('../app');
const db = require ('../db');


let testUser;                                      //set variable for the RETURNING values of id, name, type
beforeEach(async function () {          
    const result = await db.query(`INSERT INTO users (name, type) VALUES ('Peanut', 'admin')
    RETURNING id, name, type`);                   //beforeEach is a JEST function (needs to be async func because 
    testUser = result.rows[0]                      //we are using db.query. 
});                 
    

afterEach(async function() {                     //afterEach is JEST function 
    await db.query(`DELETE FROM users`);
});

afterAll(async function() {                     //JEST needs the asynchronous operations to stop after they run for testing.
    await db.end()                              //With the pg package, we have opened a connection with our database,
});                                             // that connection will continue until we end it. db.end is a method
                                                // in pg that will stop the connection with the database. 
   
                                                
describe("Get /users", function() {
    test("Get a list with one user", async function() {
        const result = await request(app).get('/users')
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ users: [testUser] })  //object with users as key and array with the
    })                                                       //users that are in the database. 
});                                              

describe("Get /users/:id", function() {
    test("Gets a single user", async function() {
        const result = await request(app).get(`/users/${testUser.id}`);
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual({ user: testUser })     //do not need to set testUser to be an array here. 
    })   
    test("Responds with 404 for invalid id", async function() {
        const result = await request(app).get(`/users/0`)
        expect(result.statusCode).toBe(404);
    })                                                   
});         

describe("POST /users", function() {
    test("Creates a single user", async function(){
    const result = await request(app).post('/users').send({name: 'BillyBob', type: 'staff'});
    expect(result.statusCode).toBe(201);    
    expect(result.body).toEqual({
        user: { id: expect.any(Number), name: 'BillyBob', type: 'staff' }
    })
    })
});


describe("PATCH /users", function() {
    test("Updates a single user", async function(){
    const result = await request(app).patch(`/users/${testUser.id}`).send({name: 'BillyBob', type: 'admin'});
    expect(result.statusCode).toBe(200);    
    expect(result.body).toEqual({
        user: { id: testUser.id, name: 'BillyBob', type: 'admin' }
     })
   }) 
    test("Responds with 404 for invalid id", async function(){
    const result = await request(app).patch(`/users/0`).send({name: 'BillyBob', type: 'admin'});
    expect(result.statusCode).toBe(404);
    })
});

describe("DELETE /users/:id", function() {
    test("Deletes a single user", async function(){
    const result = await request(app).delete(`/users/${testUser.id}`);
    expect(result.statusCode).toBe(200);    
    expect(result.body).toEqual({msg: "DELETED!"})
  })
});
 
