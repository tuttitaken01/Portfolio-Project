const express = require('express');
const app = express();
app.use(express.json());

const {
    serverStatus,
    getCategories,
    getReviews
} = require('./controllers/controllers.js')

const {
    standardErrorHandler
} = require("./controllers/error-controller.js");

// ENDPOINTS
app.get('/api', serverStatus);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);


// ERROR HANDLING FUNCTIONS 
app.use(standardErrorHandler);


module.exports = app;