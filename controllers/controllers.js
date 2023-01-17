const { 
    selCategories,
    selReviews,
    fetchReview,
    fetchComments,
    addComment
} = require("../models.js");

exports.serverStatus = (req, res) => {
    res.status(200).send({ msg: "Server doing fine" });
}

exports.getCategories = (req, res, next) => {
    selCategories()
    .then((categories) => {
        res.status(200).send({ categories });
    })
    .catch(err => {
        //console.log(err);
        next(err);
    })
}

exports.getReviews = (req, res, next) => {
    selReviews()
    .then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch(err => {
        //console.log(err);
        next(err);
    })
}

exports.getReviewById = (req, res, next) => {
    const { id } = req.params;
    return fetchReview(id)
    .then((reviewData) => {
        res.status(200).send({ review: reviewData });
    })
    .catch(err => {
        //console.log(err);
        next(err);
    })
}

exports.getCommentsById = (req, res, next) => {
    const { id } = req.params;
    return fetchReview(id)
    .then(() => {
        return fetchComments(id);
    })
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(err => {
        //console.log(err);
        next(err);
    })
}

exports.postCommentById = (req, res, next) => {
    let reviewId = req.params["id"];
    let { username, body } = req.body;
    return addComment(reviewId, username, body)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(err => {
        //console.log(err);
        next(err);
    })
}