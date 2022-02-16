const assert = require('assert');
const { Context } = require('mocha');
const db = require('../config/db.config')
const chai = require('chai');
const expect = chai.expect;
const userControl = require('../controller/user.controller');
const server = require('../index');
const chaiHttp = require("chai-http")
const should = require('should')

chai.should();
// const should = chai.should;
chai.use(chaiHttp);


describe('Entry point', () => {

    // "firstName": "xinyi",
    // "lastName" : "chen",
    // "emailId" : "chen3@sample.com",
    // "password": "333"

    context('post register', () => {
        it('should return 200 status ', (done) => {
            chai.request(server)
                .post("user/register?firstName=xinyi&lastName=chen&emailId=chen1@sample.com&password=111")
                .end((err, res) => {
                    // expect(res).to.have.status(200)
                    should.exist(res.body);
                    res.should.have.status(200);
                    // res.should.be.json;
                    // response.body.length.should.not.be.eq(0);
                    done();
                })
        })
    });


    context('get', () => {
        it('should ', (done) => {
            chai.request(server)
                .get("users/self")
                .end((err, response) => {
                    should.exist(response.body);
                    should.not.exist(err);
                    response.should.be.json;;
                    //should(response.body).be.a('array')
                    response.should.have.status(200);
                    // response.body.length.should.not.be.eq(0);
                    done();
                })
        })
    });

    
 

    // context('post', () => {
    //     it('should ', (done) => {
    //         userControl.register(null, (err, result) => {
    //             expect(err).to.exist;
    //             expect(err.message).to.equal('invalid user');
    //             expect(result).to.be.a('object');

    //             done();
    //         })
    //     });

    // });


    // context('post', () => {
    //     it('should ', (done) => {
    //         userControl.register(null, (err, result) => {
    //             expect(err).to.exist;
    //             expect(err.message).to.equal('invalid user');
    //             expect(result).to.be.a('object');

    //             done();
    //         })
    //     });

    // });

    // context('post', () => {
    //     it('should ', (done) => {
    //         userControl.login(null, (err, result) => {
    //             expect(err).to.exist;
    //             expect(err.message).to.equal('invalid user');
    //             expect(result).to.be.a('object');

    //             done();
    //         })
    //     });

    // });



});

