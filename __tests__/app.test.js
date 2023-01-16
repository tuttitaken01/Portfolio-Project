const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeEach(() => {
    return seed(data);
});

afterAll(() => db.end());

describe("0.serverStatus", () => {
    describe("GET /api", () => {
        test("status: 200, responds with a message", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual({
                    msg: "Server doing fine",
                });
            });
        });
    });
})
/*
describe("1.getCategories", () => {
    describe("GET /api/categories", () => {
        test("returns an array of objects", () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then((res) => {
                let categories = res.body.categories;
                expect(Array.isArray(categories)).toBe(true);
            })
        })
    })
})
*/