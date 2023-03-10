const db = require('../db/connection.js');


exports.reviewID = (id) => {
    let regex = RegExp(/^\W?[0-9]+$/);
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
    return db.query(`
    SELECT *
    FROM users
    WHERE username=$1;`, [username])
    .then(username => {
        if(username.rows.length > 0) {
            return username.rows;
        } else {
            return Promise.reject({ status: 400, msg: "Bad Request" })
        } 
    })
}

exports.catExists = (category) => {
    if (category === undefined) {
        return Promise.resolve();
    }
    return db.query(`
    SELECT *
    FROM categories WHERE slug=$1;`, [category])
    .then(res => {
        if (res.rows.length ===0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
            return Promise.resolve();
        }
    })
    .catch(err => {
        if(err.status === 404) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
            return Promise.reject({ status: 400, msg: "Bad Request" });
        }
    })
}

exports.commExists = (comment) => {
    let regex = RegExp(/^\W?[0-9]+$/);
    if(regex.test(comment) === false) {
        return Promise.reject({ status: 400, msg: "Bad Request"});
    }
    return db.query(`
    SELECT *
    FROM comments
    WHERE comment_id=${comment};`)
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