exports.standardErrorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg : err.msg });
    } else {
        next(err);
    }
}

exports.notFoundHandler = (req, res, next) => {
    res.status(404).send({ msg: "Not Found" });
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.code == "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    }
    if(err.code == "23502") {
        res.status(400).send({ msg: "Bad Request" });
    }
}