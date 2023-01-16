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
        test("returns a 404 status code if path is not valid", () => {
            return request(app)
            .get("/api/category")
            .expect(404)
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
        test("returns a 404 status code if path not valid", () => {
            return request(app)
            .get("/api/review")
            .expect(404)
        })
    })
})


