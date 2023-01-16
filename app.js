const express = require('express');
const app = express();
app.use(express.json());

const {
    serverStatus,
    getCategories
} = require('./controllers.js')

app.get('/api', serverStatus);
//app.get('/api/categories', getCategories);

const { PORT = 9090 } = process.env;

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening on ${PORT}`);
})

module.exports = app;