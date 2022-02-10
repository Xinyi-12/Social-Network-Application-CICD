let server = require('../index');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

//const app = require()
// chai.request(server).get("/get-all-posts")
// chai.request(server).get("/api/chow/users")

/*
  * Test the /GET route
  */
describe("Entry point", () => {
    context("GET /posts/get-all-posts", () => {
        it("should get all posts", (done) => {
            chai.request(server)
                .get("/posts")
                .end((err, res) => {
                    if (err) throw err;
                    res.text.should.equal("Hello World!");
                    done();
                });
        });
    });
});


