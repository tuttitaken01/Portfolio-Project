const { selCategories } = require("./models.js");

exports.serverStatus = (req, res) => {
    res.status(200).send({ msg: "Server doing fine" });
}

exports.getCategories = (req, res) => {
    selCategories()
    .then((categories) => {
        res.status(200).send({ categories });
    })
}