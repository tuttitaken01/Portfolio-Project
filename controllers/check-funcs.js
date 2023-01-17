const db = require('../db/connection.js');
const { selUsers } = require('../models.js');
exports.reviewID = (id) => {
    regex = RegExp(/^\W?[0-9]+$/);
    if(regex.test(id) === false) {
        return Promise.reject({ status: 400, msg: "Bad Request"});
    }
    return db.query(`
    SELECT *
    FROM reviews
    WHERE review_id=$1;`, [id])
    .then(({ rows }) => {
        if (rows.length > 0) {
            return true;
        } else {
            return false;
        }
    })
    .catch(() => {
        return false;
    })
}

exports.validateKeys = (req, arr) => {
    const keys = Object.keys(req);
    let output = true;

    for (let i = 0; i < keys.length; i++) {
        if (!arr.includes(keys[i])) {
            output = false;
        }
    }
    return output;
}

exports.userExists = (username) => {
    return selUsers(username)
    .then(username => {
        if(username.length === 0) {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        }
    })

}

