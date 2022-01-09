const express = require('express')
const app = express()
app.use(express.json())

const courses = [
    { id:1 , name:'course1'},
    { id:2 , name:'course2'}
]

app.get('/api', (req, res) => {
    res.send('Hello GOAT! sup');
});


const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}`))