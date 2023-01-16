const db = require("./db/connection.js")
exports.selCategories = (req,res) => {
    return db.query("SELECT * FROM categories;")
    .then(result => {
        console.log(result.rows);
        return result.rows;
    })
}