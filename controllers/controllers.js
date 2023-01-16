const { 
    selCategories,
    selReviews
} = require("../models.js");

exports.serverStatus = (req, res) => {
    res.status(200).send({ msg: "Server doing fine" });
}

exports.getCategories = (req, res) => {
    selCategories()
    .then((categories) => {
        res.status(200).send({ categories });
    })
    .catch(err => {
        console.log(err);
        next(err);
    })
}

exports.getReviews = (req, res) => {
    selReviews()
    .then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch(err => {
        console.log(err);
        next(err);
    })
}