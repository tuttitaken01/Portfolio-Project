const { 
    selCategories,
    selReviews,
    fetchReview,
    fetchComments,
    addComment,
    updateVotes,
    selAllUsers
} = require("../models.js");

const {
    reviewID,
    validateKeys,
    userExists
} = require("./check-funcs.js")

exports.serverStatus = (req, res) => {
    res.status(200).send({ msg: "Server doing fine" });
}

exports.getCategories = (req, res, next) => {
    selCategories()
    .then((categories) => {
        res.status(200).send({ categories });
    })
    .catch(err => {
        next(err);
    })
}

exports.getReviews = (req, res, next) => {
    selReviews()
    .then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch(err => {
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
        next(err);
    })
}

exports.postCommentById = (req, res, next) => {
    let id = req.params["id"];
    let { username, body } = req.body;
    if (validateKeys(req.body, ["username", "body"])) {
        reviewID(id)
        .then(idTrue => {
            if (idTrue === false) {
                return Promise.reject({ status: 400, msg: "Bad Request" });
            }
        })
        .then(() => {
            return userExists(username);
        })
        .then(() => {
            return addComment(id, username, body);
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(err => {
            next(err);
        })
    } else {
        throw { status: 400, msg: "Bad Request" };
    }
}

exports.patchReview = (req, res, next) => {
    const id = req.params.id;
    const votes = req.body.inc_votes;
    reviewID(id)
    .then(idTrue => {
        let regex = RegExp(/^\W?[0-9]+$/)
        if (validateKeys(req.body, ["inc_votes"]) === false) {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        } else if (idTrue === false) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } else if (regex.test(votes) === false) {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        }
    })
    .then(() => {
        return updateVotes(id, votes);
    })
    .then((newReview) => {
        res.status(200).send({ newReview });
    })
    .catch(err => {
        next(err);
    })
}

exports.getUsers = (req, res, next) => {
    selAllUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
}