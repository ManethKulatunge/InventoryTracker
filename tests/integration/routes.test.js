const supertest = require('supertest')
const app = require('./../../index.js')
const request = supertest(app)
const {Inventory, validate} = require('./../../models/inventory');

const mongoose_test = require('mongoose')
const databaseName = "testdb";

beforeAll(done => {
    jest.useFakeTimers('legacy')
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

describe('POST /api/inventory', () => {

    it("should save product to database", async () => {
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 55,
            quantity : 33
        })
        
        expect(res.status).toEqual(200);
    });

    it("should save product to database (including summary and category) ", async () => {
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 55,
            quantity : 33,
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        expect(res.status).toEqual(200);
    });

    it("should NOT save product to database, and should return error: name should be atleast 5 characters", async () => {
        
        const res = await request.post('/api/inventory').send({
            name : "food",
            price : 55,
            quantity : 33
        })
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" length must be at least 5 characters long')
    });

    it("should NOT save product to database, and should return error: price is required", async () => {
        
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            quantity : 33
        })
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"price" is required')
    });

    it("should NOT save product to database, and should return error: quantity is required", async () => {
        
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 33
        })
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"quantity" is required')
    });

    it("should NOT save product to database, and should return error: name is required", async () => {
        
        const res = await request.post('/api/inventory').send({
            price : 55,
            quantity : 33
        })
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" is required')
    });

    it("should NOT save product to database, category should be an array ", async () => {
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 55,
            quantity : 33,
            category: '',
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"category" must be an array')
    });

    it("should NOT save product to database, name should be string ", async () => {
        const res = await request.post('/api/inventory').send({
            name : 1234,
            price : 55,
            quantity : 33,
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" must be a string')
    });

    it("should NOT save product to database, price should be a number ", async () => {
        const res = await request.post('/api/inventory').send({
            name : "fooditem",
            price : "f55",
            quantity : 33,
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"price" must be a number')
    });

    it("should NOT save product to database, quantity should be a number ", async () => {
        const res = await request.post('/api/inventory').send({
            name : "fooditem",
            price : 55,
            quantity : "f1233",
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"quantity" must be a number')
    });
});

describe('GET /api/inventory', () => {
    it("should return all products", async () => {
        
        const product = new Inventory({ name: 'CHEESE',price:45,quantity:33 });
        await product.save()

        const res = await request.get("/api/inventory").send()
        expect(res.body.some(g => g.name === 'CHEESE')).toBeTruthy();
        expect(res.status).toEqual(200);
    });
});
