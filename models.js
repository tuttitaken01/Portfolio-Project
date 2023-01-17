const db = require("./db/connection.js")

exports.selCategories = (req,res) => {
    return db.query(`
    SELECT * 
    FROM categories;`)
    .then(result => {
        return result.rows;
    });
}

exports.selReviews = () => {
    return db.query(`
    SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.designer, reviews.votes,
    COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`)
    .then(result => {
        return result.rows;
    })
}

exports.fetchReview = (id) => {
    return db.query(`
    SELECT reviews.*, COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
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