const db = require("./db/connection.js");

exports.serverStatus = (req, res) => {
    res.status(200).send({ msg: "Server doing fine" });
}

/*exports.getCatgories = (req, res) => {
    return db.query("SELECT * FROM categories;")
    .then(result => {
        return result.rows;
    })
    .then((categories) => {
        res.status(200).send({ categories });
    })
} */