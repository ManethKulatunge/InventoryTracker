const supertest = require('supertest')
const app = require('./../../index.js')
const request = supertest(app)
const {Inventory, validate} = require('./../../models/inventory');
const mongoose_test = require('mongoose')
const databaseName = "testdb";


beforeAll(done => {
    jest.useFakeTimers('legacy')
    const url = `mongodb://localhost/${databaseName}`
    mongoose_test.set('useFindAndModify', false);
      
    mongoose_test.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...'));
    done()
    
})

afterAll(done => { 
    mongoose_test.connection.close()
    done()
});

describe('POST /api/inventory', () => {

    it("should SAVE to database and RETURN 200 and the item details", async () => {
        const res = await request.post('/api/inventory').send({
            name : "item1",
            price : 55,
            quantity : 33
        })

        // Ensures response returns status 200
        expect(res.status).toEqual(200);
        // Ensures response contains id,name,price,and quantity
        expect(res.body).toHaveProperty('_id', 'name', 'price', 'quantity')

        // Searches the item in the database
        const item = await Inventory.findOne({ name: 'item1' })
        expect(item.name).toBeTruthy()
        expect(item.price).toBeTruthy()
        expect(item.quantity).toBeTruthy()
    });

    it("should SAVE to database and RETURN 200 and the item details (with category and summary)", async () => {
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

        // Searches the item in the database
        const item = await Inventory.findOne({ name: 'item1' })
        expect(item.name).toBeTruthy()
        expect(item.price).toBeTruthy()
        expect(item.quantity).toBeTruthy()
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
    it("should return item and 200 status", async () => {
        //create new item and save it in the database
        const item = new Inventory({ name: 'stationerybundle',price:45,quantity:33 });
        await item.save()

        //check if result from get request contains aforementioned item
        const res = await request.get("/api/inventory").send()
        expect(res.status).toEqual(200);
        expect(res.body.some(entry => entry.name === 'stationerybundle')).toBeTruthy();
    });

    it("should return all items and 200 status", async () => {
        //create new items and save it in the database
        const items = [
            { name: 'stationerybundle',price:45,quantity:33 },
            { name: 'itembundle',price:55,quantity:33 }
        ]

        await Inventory.collection.insertMany(items)

        //check if result from get request contains aforementioned items
        const res = await request.get("/api/inventory").send()
        expect(res.status).toEqual(200);
        expect(res.body.some(entry => entry.name === 'stationerybundle')).toBeTruthy();
        expect(res.body.some(entry => entry.name === 'itembundle')).toBeTruthy();
    });
});

describe('GET /:id', () => {
    it('should return a item if valid id is passed', async () => {
      //create new item and save it in the database
      const item = new Inventory({ name: 'stationerybundle',price:45,quantity:33 });
      await item.save()

      const res = await request.get('/api/inventory/' + item._id);
      
      //checking if the id used returns accurate values in the response body
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', item.name);  
      expect(res.body).toHaveProperty('quantity', item.quantity);  
      expect(res.body).toHaveProperty('price', item.price);  
    });

    it('should return 404 if incorrect id is passed', async () => {
        const res = await request.get('/api/inventory/1');
        expect(res.status).toBe(404);
        expect(res.text).toEqual('Enter a valid id')
      });

    it('should return 404 if no item with the given id exists', async () => {
      const id = mongoose_test.Types.ObjectId();
      const res = await request.get('/api/inventory/' + id);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/inventory/:id', () => {
    let putName;
    let putPrice;
    let putQuantity;
    let putCategory;

    const exec = async () => {
      return await request
        .put('/api/inventory/' + id)
        .send({ name: putName, price: putPrice, quantity: putQuantity, category: putCategory });
    }

    beforeEach(async () => {
      // Before each test we need to create an item and 
      // put it in the database.      
      item = new Inventory({ name: 'item1', price:30, quantity:60, category:["food", "perishable"]});
      await item.save();
       
      id = item._id; 
      putName = "item1.1"
      putPrice = 40
      putQuantity = 70
      putCategory = ["stationery", "non-perish"]
    })

    it('should update the item if request is valid', async () => {
        await exec();
        const updatedItem = await Inventory.findById(item._id);
        
        //checking if item details are updated
        expect(updatedItem.name).toBe(putName);
        expect(updatedItem.price).toBe(putPrice);
        expect(updatedItem.quantity).toBe(putQuantity);
    });

    it('should return the item if request is valid', async () => {
        const res = await exec();
        
        //checking if item details are updated
        expect(res.body.name).toBe(putName);
        expect(res.body.price).toBe(putPrice);
        expect(res.body.quantity).toBe(putQuantity);
    });

    it('should return 400 if item is less than 5 characters', async () => {
        putName = '1234'; 
        const res = await exec();
  
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" length must be at least 5 characters long')
    });

    it('should return 400 if price is not a number', async () => {
        putPrice = "f55";
        const res = await exec();
  
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"price" must be a number')
    });

    it('should return 400 if quantity is not a number', async () => {
        putQuantity = "f55";
        const res = await exec();
  
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"quantity" must be a number')
    });

    it('should return 400 if quantity is not a number', async () => {
        putName = 1234;
        const res = await exec();
  
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"name" must be a string')
    });

    it('should return 400 if quantity is not a number', async () => {
        putCategory = 23;
        const res = await exec();
  
        expect(res.status).toEqual(400);
        expect(res.text).toEqual('"category" must be an array')
    });

    it('should return 404 if incorrect id is passed', async () => {
        const res = await request.put('/api/inventory/1');
        expect(res.status).toBe(404);
        expect(res.text).toEqual('Enter a valid id')
    });

    it('should return 404 if item with the given id was not found', async () => {
        id = mongoose_test.Types.ObjectId();
        const res = await exec();
  
        expect(res.status).toBe(404);
        expect(res.text).toEqual('The item with the given ID was not found.')
    });
  });

    describe('DELETE /:id', () => {
        let id; 
    
        const exec = async () => {
          return await request
            .delete('/api/inventory/' + id)
            .send();
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          item = new Inventory({ name: 'item1', price:30, quantity:60, category:["food", "perishable"]});
          await item.save();
          
          id = item._id;  
        })
    
        it('should return 404 if id is invalid', async () => {
          id = 1;  
          const res = await exec();
    
          expect(res.status).toBe(404);
          expect(res.text).toEqual('Enter a valid id')
        });
    
        it('should return 404 if no item with the given id was found', async () => {
          id = mongoose_test.Types.ObjectId();
          const res = await exec();

          expect(res.status).toBe(404);
          expect(res.text).toEqual('The item with the given ID was not found.')
        });
    
        it('should delete the genre if input is valid', async () => {
          await exec();
    
          const itemInDb = await Inventory.findById(id);
          expect(itemInDb).toBeNull();
        });
    
        it('should return the removed genre', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', item._id.toHexString());
          expect(res.body).toHaveProperty('name', item.name);
        });
    });