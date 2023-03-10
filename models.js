const { commExists } = require("./controllers/check-funcs.js");
const db = require("./db/connection.js")

exports.selCategories = (req,res) => {
    return db.query(`
    SELECT * 
    FROM categories;`)
    .then(result => {
        return result.rows;
    });
}

exports.selReviews = (category = undefined, sortBy = 'created_at', order = 'DESC') => {
    if (category !== undefined) {
        return db.query(`
        SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.designer, reviews.votes,
        COUNT(comments.comment_id) :: INT AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE category=$1
        GROUP BY reviews.review_id
        ORDER BY ${sortBy} ${order};`, [category])
        .then(result => {
            return result.rows;
        })
    } else if (category === undefined) {
        return db.query(`
        SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.designer, reviews.votes,
        COUNT(comments.comment_id) :: INT AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY ${sortBy} ${order};`)
        .then(result => {
            return result.rows;
        })
    }
}
    
    

exports.fetchReview = (id) => {
    return db.query(`
    SELECT reviews.*, COUNT(comments.comment_id) :: INT AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id=$1
    GROUP BY reviews.review_id;`, [id])
    .then(result => {
        if(result.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "Not Found"
            })
        }
        return result.rows[0];
    })
} 

exports.fetchComments = (id) => {
    return db.query(`
    SELECT *
    FROM comments
    WHERE review_id=$1;`, [id])
    .then(result => {
        return result.rows;
    })
}

exports.addComment = (id, username, body) => {
    let createdAt = new Date();
    return db.query(`
    INSERT INTO comments (body, votes, author, review_id, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`, [body, 0, username, id, createdAt])
    .then(res => {
        return res.rows;
    })
}

exports.selUsers = (username) => {
    return db.query(`
    SELECT *
    FROM users
    WHERE username=$1;`, [username])
    .then(res => {
        return res.rows;
    })
}

exports.updateVotes = (id, votes) => {
    return db.query(`
    SELECT review_id, votes
    FROM reviews
    WHERE review_id=$1;`, [id])
    .then(res => {
        return res.rows[0]["votes"];
    })
    .then(current => {
        let newVotes = current + votes;
        return db.query(`
        UPDATE reviews
        SET votes=${newVotes}
        WHERE review_id=$1
        RETURNING *;`, [id])
        .then(result => {
            return result.rows[0];
        })
    })
}

exports.selAllUsers = () => {
    return db.query(`
    SELECT * 
    FROM users;`)
    .then(res => {
        return res.rows;
    })
}

exports.deleteComm = (id) => {
    return commExists(id)
    .then(exists => {
        if (exists === false) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
    })
    .then(() => {
        return db.query(`
        DELETE FROM comments
        WHERE comment_id=$1
        RETURNING *;`, [id])
    })
    .then(res => {
        return res.rows[0];
    })
}

exports.fetchAllComments = () => {
    return db.query(`
    SELECT *
    FROM comments;`)
    .then(res => {
        return res.rows;
    })
}