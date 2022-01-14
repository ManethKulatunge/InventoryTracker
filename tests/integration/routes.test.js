const supertest = require('supertest')
const app = require('./../../index.js')
const request = supertest(app)

const mongoose_test = require('mongoose')
const databaseName = "testdb";

const test_inventory = mongoose_test.model('test_inventory', new mongoose_test.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    summary: {
      type: String, 
      required: false,
      maxlength: 140
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    category: {
      type:Array, 
      require:true
    }
  
}))

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

it("Should save user to database", async () => {
    const res = await request.get("/api/inventory").send()
    const genres = [
        { name: 'genre1' },
        { name: 'genre2' },
    ];
    
    expect(res.status).toEqual(200);
});
