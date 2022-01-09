const express = require('express');
const router = express.Router();

const courses = [
    { id:1 , name:'course1'},
    { id:2 , name:'course2'}
]

router.get('/', (req, res) => {
    res.send('Hello!');
});

module.exports = router;