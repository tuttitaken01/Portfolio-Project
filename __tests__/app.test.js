const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("0.serverStatus", () => {
    describe("GET /api", () => {
        test("status: 200, responds with a message", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual({
                    msg: "Server doing fine"
                });
            });
        });
    });
})

describe("1.getCategories", () => {
    describe("GET /api/categories", () => {
        test("returns an array of objects of length 4", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(res => {
                let categories = res.body.categories;
                expect(Array.isArray(categories)).toBe(true);
                expect(categories).toHaveLength(4)
            });
        })
        test("each object has SLUG and DESCRIPTION properties", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(res => {
                categories = res.body.categories;
                categories.forEach(cat => {
                    expect(cat.hasOwnProperty("slug")).toBe(true);
                    expect(cat.hasOwnProperty("description")).toBe(true);
                })
            })
        })
        test("returns a 404 status code if path is not found", () => {
            return request(app)
            .get("/api/category")
            .expect(404)
            .then(res => {
                expect(res.body.msg).toBe("Not Found");
            })
        })
    })
})

describe("2.getReviews", () => {
    describe("GET /api/reviews", () => {
        test("returns an array of objects of length 13", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(res => {
                let reviews = res.body.reviews;
                expect(Array.isArray(reviews)).toBe(true);
                expect(reviews.length).toBe(13);
            })
        })
        test("each object has id, owner, title, category, url, date, designer, votes and comment_count properties", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(res => {
                reviews = res.body.reviews;
                reviews.forEach(rev => {
                    expect(rev.hasOwnProperty("review_id")).toBe(true);
                    expect(rev.hasOwnProperty("owner")).toBe(true);
                    expect(rev.hasOwnProperty("title")).toBe(true);
                    expect(rev.hasOwnProperty("category")).toBe(true);
                    expect(rev.hasOwnProperty("review_img_url")).toBe(true);
                    expect(rev.hasOwnProperty("created_at")).toBe(true);
                    expect(rev.hasOwnProperty("designer")).toBe(true);
                    expect(rev.hasOwnProperty("votes")).toBe(true);
                    expect(rev.hasOwnProperty("comment_count")).toBe(true);
                })
            })
        })
        test("the comment_count properts indicates the number of comments associated to a review_id", () => {
            return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(res => {
                reviews = res.body.reviews;
                if (reviews.review_id === 2 || reviews.review_id === 2) {
                    expect(reviews.comment_count).toBe(3);
                }          
            })
        })
    })
})

describe("3.getReviewById", () => {
    describe("GET /api/reviews/:id", () => {
        test("returns a single review", () => {
            return request(app)
            .get("/api/reviews/3")
            .expect(200)
            .then(res => {
                let review = res.body.review;
                expect(typeof(review)).toBe("object");
                expect(review).toMatchObject({
                    review_id: 3,
                    title: 'Ultimate Werewolf',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface',
                    review_img_url:
                      'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                    review_body: "We couldn't find the werewolf!",
                    category: 'social deduction',
                    created_at: "2021-01-18T09:01:41.251Z",
                    votes: 5
                  })
            })
        })
        test("returns a 404 error if input number does not exist", () => {
            return request(app)
            .get("/api/reviews/150")
            .expect(404)
            .then(res => {
                expect(res.body.msg).toBe("Not Found");
            })
        })
        test("returns a 400 error if input is not number type", () => {
            return request(app)
            .get("/api/reviews/abc")
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
    }) 
})

describe("4.getCommentsById", () => {
    describe("GET /api/reviews/:id/comments", () => {
        test("returns an array of comments", () => {
            return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(res => {
                let comments = res.body.comments;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments).toHaveLength(3);
            })
        })
        test("returns an empty array if id is valid but no comments are found", () => {
            return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(res => {
                comments = res.body.comments;
                expect(comments).toHaveLength(0);
            })
        })
        test("returns a 404 error if input is not found", () => {
            return request(app)
            .get("/api/reviews/47/comments")
            .expect(404)
            .then(res => {
                expect(res.body.msg).toBe("Not Found");
            })
        })
        test("returns a 400 error if input is not number type", () => {
            return request(app)
            .get("/api/reviews/dj/comments")
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
    })
})

describe("5.postCommentById", () => {
    describe("POST /api/reviews/:id/comments", () => {
        test("returns a comment object", () => {
            return request(app)
            .post("/api/reviews/1/comments")
            .send({ username: "dav3rid", body: "Testing a body" })
            .expect(201)
            .then(res => {
                let comment = res.body.comment
                expect(typeof(comment)).toBe("object");
            })
        })
        test("returns the posted comment", () => {
            return request(app)
            .post("/api/reviews/1/comments")
            .send({ username: "dav3rid", body: "Testing a body" })
            .expect(201)
            .then(res => {
                let comment = res.body.comment
                expect(comment[0]).toMatchObject({
                    comment_id: 7,
                    body: 'Testing a body',
                    review_id: 1,
                    author: 'dav3rid',
                    votes: 0,
                    created_at: expect.any(String), //new Date()
                });
            })
        })
        test("returns a 400 error if a different format input is given. accepted => {username: '', body:'') ", () => {
            return request(app)
            .post("/api/reviews/1/comments")
            .send({ username: "X" })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
        test("returns a 400 error for an invalid review_id - wrong format", () => {
            return request(app)
            .post("/api/reviews/abc/comments")
            .send({ username: "dav3rid", body: "Testing body" })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
        test("returns a 400 error for an invalid review_id - out of range", () => {
            return request(app)
            .post("/api/reviews/47/comments")
            .send({ username: "dav3rid", body: "Testing body" })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
        test("returns a 400 error if user does not exist", () => {
            return request(app)
            .post("/api/reviews/1/comments")
            .send({ username: "davtrid", body: "Testing body" })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
        test("returns a 400 error if there are more keys than needed", () => {
            return request(app)
            .post("/api/reviews/1/comments")
            .send({ username: "dav3rid", body: "Testing body", mood: "happy" })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })
        })
    })
})

describe("6.patchReview", () => {
    describe("PATCH /api/reviews/:id", () => {
        test("returns a review object with the correct number of votes (addition)", () => {
            return request(app)
            .patch("/api/reviews/1")
            .send({inc_votes : 3 })
            .expect(200)
            .then(res => {
                let updated = res.body.newReview;
                expect(updated).toBeInstanceOf(Object);
                expect(updated).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: 4,
                })
            })
        })
        test("returns a review object with the correct number of votes (subtraction)", () => {
            return request(app)
            .patch("/api/reviews/9")
            .send({inc_votes : -7 })
            .expect(200)
            .then(res => {
                let updated = res.body.newReview;
                expect(updated).toBeInstanceOf(Object);
                expect(updated).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: 3,
                })
            })
        })
        test("returns a 404 error if reviewId does not exist", () => {
            return request(app)
            .patch("/api/reviews/49")
            .send({inc_votes : -7 })
            .expect(404)
            .then(res => {
                expect(res.body.msg).toBe("Not Found");
            })          
        })
        test("returns a 400 error if queried with a non valid object - no number", () => {
            return request(app)
            .patch("/api/reviews/1")
            .send({inc_votes : "take" })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })  
        })
        test("returns a 400 error if queried with a non valid object - no value", () => {
            return request(app)
            .patch("/api/reviews/1")
            .send({inc_votes : '' })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })  
        })
        test("returns a 400 error if object includes other non-required keys", () => {
            return request(app)
            .patch("/api/reviews/1")
            .send({inc_votes : "take", downvotes: 5 })
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })  
        })
        test("returns a 400 error if nothing is passed in", () => {
            return request(app)
            .patch("/api/reviews/1")
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Bad Request");
            })  
        })
    })
})


