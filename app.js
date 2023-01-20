const express = require('express');
const app = express();
app.use(express.json());

const {
    serverStatus,
    getCategories,
    getReviews,
    getReviewById,
    getCommentsById,
    postCommentById,
    patchReview,
    getUsers,
    getUsername,
    delComment
} = require('./controllers/controllers.js')

const {
    standardErrorHandler,
    customErrorHandler,
    notFoundHandler
} = require("./controllers/error-controller.js");

// ENDPOINTS
app.get('/api', serverStatus);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:id', getReviewById);
app.get('/api/reviews/:id/comments', getCommentsById);
app.post('/api/reviews/:id/comments', postCommentById);
app.patch('/api/reviews/:id', patchReview);
app.get('/api/users', getUsers);
app.get('/api/users/:username', getUsername);
app.delete('/api/comments/:commId', delComment)

// ERROR HANDLING FUNCTIONS 
app.use(standardErrorHandler);
app.use(notFoundHandler);
app.use(customErrorHandler);


module.exports = app;