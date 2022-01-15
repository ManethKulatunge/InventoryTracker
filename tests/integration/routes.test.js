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

    it("should SAVE to database and RETURN 200 and the product details", async () => {
        const res = await request.post('/api/inventory').send({
            name : "product1",
            price : 55,
            quantity : 33
        })

        // Ensures response returns status 200
        expect(res.status).toEqual(200);
        // Ensures response contains id,name,price,and quantity
        expect(res.body).toHaveProperty('_id', 'name', 'price', 'quantity')

        // Searches the product in the database
        const product = await Inventory.findOne({ name: 'product1' })
        expect(product.name).toBeTruthy()
        expect(product.price).toBeTruthy()
        expect(product.quantity).toBeTruthy()
    });

    it("should SAVE to database and RETURN 200 and the product details (with category and summary)", async () => {
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 55,
            quantity : 33,
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })

        // Ensures response returns status 200
        expect(res.status).toEqual(200);
        // Ensures response contains id,name,price,and quantity
        expect(res.body).toHaveProperty('_id', 'name', 'price', 'quantity', 'category', 'summary')

        // Searches the product in the database
        const product = await Inventory.findOne({ name: 'product1' })
        expect(product.name).toBeTruthy()
        expect(product.price).toBeTruthy()
        expect(product.quantity).toBeTruthy()
    });

    it("should return 400, and error: name should be atleast 5 characters", async () => {
        //sending request with 4 characters in "name" 
        const res = await request.post('/api/inventory').send({
            name : "food",
            price : 55,
            quantity : 33
        })

        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" length must be at least 5 characters long')
    });

    it("should return 400, and error: price is required", async () => {
        //sending request without "price"
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            quantity : 33
        })

        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"price" is required')
    });

    it("should return 400, and error: quantity is required", async () => {
        //sending request without "quantity"  
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 33
        })

        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"quantity" is required')
    });

    it("should return 400, and error: name is required", async () => {
        ////sending request without "name"  
        const res = await request.post('/api/inventory').send({
            price : 55,
            quantity : 33
        })

        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" is required')
    });

    it("should return 400, and error: category should be an array ", async () => {
        //sending request without entering an array in category 
        const res = await request.post('/api/inventory').send({
            name : "fooditem1",
            price : 55,
            quantity : 33,
            category: '',
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"category" must be an array')
    });

    it("should return 400, and error: name should be string ", async () => {
        //sending request with error in "name"  
        const res = await request.post('/api/inventory').send({
            name : 1234,
            price : 55,
            quantity : 33,
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" must be a string')
    });

    it("should return 400, and error: price should be a number ", async () => {
        //sending request with error in "price"  
        const res = await request.post('/api/inventory').send({
            name : "fooditem",
            price : "f55",
            quantity : 33,
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"price" must be a number')
    });

    it("should return 400, and error: quantity should be a number ", async () => {
        //sending request with error in "quantity"  
        const res = await request.post('/api/inventory').send({
            name : "fooditem",
            price : 55,
            quantity : "f1233",
            category: ["perishable", "food"],
            summary: "food item is considered in the food category. maximum delivery time is 24 houurs"
        })
        
        // Ensures response returns status 400 and the relevant error
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"quantity" must be a number')
    });
});

describe('GET /api/inventory', () => {
    it("should return product and 200 status", async () => {
        //create new product and save it in the database
        const product = new Inventory({ name: 'stationerybundle',price:45,quantity:33 });
        await product.save()

        //check if result from get request contains aforementioned product
        const res = await request.get("/api/inventory").send()
        expect(res.status).toEqual(200);
        expect(res.body.some(entry => entry.name === 'stationerybundle')).toBeTruthy();
    });

    it("should return all products and 200 status", async () => {
        //create new products and save it in the database
        const products = [
            { name: 'stationerybundle',price:45,quantity:33 },
            { name: 'productbundle',price:55,quantity:33 }
        ]

        await Inventory.collection.insertMany(products)

        //check if result from get request contains aforementioned products
        const res = await request.get("/api/inventory").send()
        expect(res.status).toEqual(200);
        expect(res.body.some(entry => entry.name === 'stationerybundle')).toBeTruthy();
        expect(res.body.some(entry => entry.name === 'productbundle')).toBeTruthy();
    });
});

describe('GET /:id', () => {
    it('should return a product if valid id is passed', async () => {
      //create new product and save it in the database
      const product = new Inventory({ name: 'stationerybundle',price:45,quantity:33 });
      await product.save()

      const res = await request.get('/api/inventory/' + product._id);
      
      //checking if the id used returns accurate values in the response body
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', product.name);  
      expect(res.body).toHaveProperty('quantity', product.quantity);  
      expect(res.body).toHaveProperty('price', product.price);  
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose_test.Types.ObjectId();
      const res = await request.get('/api/inventory/' + id);
      expect(res.status).toBe(404);
    });
  });
