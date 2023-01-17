const express = require('express');
const app = express();
app.use(express.json());

const {
    serverStatus,
    getCategories,
    getReviews,
    getReviewById,
    getCommentsById
} = require('./controllers/controllers.js')

const {
    standardErrorHandler,
    customErrorHandler
} = require("./controllers/error-controller.js");

// ENDPOINTS
app.get('/api', serverStatus);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:id', getReviewById);
app.get('/api/reviews/:id/comments', getCommentsById)


// ERROR HANDLING FUNCTIONS 
app.use(standardErrorHandler);
app.use(customErrorHandler);


module.exports = app;