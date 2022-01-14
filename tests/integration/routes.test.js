const supertest = require('supertest')
const app = require('./../../index.js')
const request = supertest(app)
const {Inventory, validate} = require('./../../models/inventory');

const mongoose_test = require('mongoose')
const databaseName = "testdb";

beforeAll(done => {
    const url = `mongodb://localhost/${databaseName}`
      
    mongoose_test.connect(url)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...'));
    done()
    
})

afterAll(done => { 
    mongoose_test.connection.close()
    done()
});


it("Should save user to database", async () => {
    const res = await request.post("/api/inventory").send({
        name: 'Zellsss',
        price:23,
        quantity:33
    })
    expect(res.status).toEqual(200);
  });

it("should return all products", async () => {
    
    const product = new Inventory({ name: 'CHEESE',price:45,quantity:33 });
    await product.save()

    const res = await request.get("/api/inventory").send()
    expect(res.body.some(g => g.name === 'CHEESE')).toBeTruthy();
    expect(res.status).toEqual(200);
});
