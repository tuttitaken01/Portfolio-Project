const db = require("./db/connection.js")

exports.selCategories = (req,res) => {
    return db.query("SELECT * FROM categories;")
    .then(result => {
        //console.log(result.rows);
        return result.rows;
    });
}

exports.selReviews = () => {
    return db.query(`SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.designer, reviews.votes,
    COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`)
    .then(result => {
        //console.log(result.rows);
        return result.rows;
    })
}
/*
exports.fetchReview = (id) => {
    return db.query(`SELECT *,
    COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`, [id])
    .then(result => {
        console.log(result);
        return result.rows;
    })
} */
