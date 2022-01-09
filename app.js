const inventory= require('./routes/inventory_functions');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/inventory', inventory);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));