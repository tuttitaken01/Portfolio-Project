const { 
    selCategories,
    selReviews,
    fetchReview,
    fetchComments,
    addComment,
    updateVotes,
    selAllUsers,
    selUsers,
    deleteComm,
    fetchAllComments,
} = require("../models.js");

const {
    reviewID,
    validateKeys,
    userExists,
    catExists,
    commExists
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

// REFACTORING FOR TASK 8 TRELLO BOARD
exports.getReviews = (req, res, next) => {
    const { category, sortOn, order } = req.query;
    catExists(category)
    .then(() => {
        if (order !== undefined && order !== "ASC" && order !== "DESC") {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        }
    })
    .then(() => {
        const acceptedSorts = [
            "title",
            "designer",
            "owner",
            "review_img_url",
            "review_body",
            "category",
            "created_at",
            "votes",
            "review_id",
        ];
        if (sortOn !== undefined && acceptedSorts.indexOf(sortOn) == -1) {
            return Promise.reject({ status: 400, msg:  "Bad Request" });
        }
    })
    .then (() => {
        return selReviews(category, sortOn, order);
    })
    .then((reviews) => {
        if (catExists && reviews.length === 0) {
            res.status(200).send({ msg: "204: No Content" }); 
        } else if (reviews.length === 0) {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        } else {
            res.status(200).send({ reviews });
        }
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

exports.getUsername = (req, res, next) => {
    const username = req.params.username;
    return selUsers(username)
    .then((user) => {
        if(user.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        } else {
            res.status(200).send({ user });
        }
    })
    .catch(err => {
        next(err);
    })
}

exports.delComment = (req, res, next) => {
    const id = req.params["commId"];
    commExists(id)
    .then(exists => {
        if (exists === false) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
    })
    .then(() => {
        return deleteComm(id);
    })
    .then((deleted) => {
        console.log(deleted);
        res.status(204).send();
    })
    .catch(err => {
        next(err);
    })
}

exports.getComments = (req, res, next) => {
    return fetchAllComments()
    .then((comments) => {
        res.status(200).send({ comments });
    })
}