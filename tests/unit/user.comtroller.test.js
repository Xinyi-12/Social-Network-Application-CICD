const userController = require("../../controller/user.controller");
const userRoutes = require("../../routes/users.route");
const httpMocks = require("node-mocks-http");
const newdata = require("../mock-data/user.json");

userController.register = jest.fn();
let req, res , next;
beforeEach(()=>{
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
})

describe("user",()=>{
    beforeEach(()=>{
        req.body = ;
    })
    it("......", ()=>{
        expect((typeof userController.register).toBe("function"))
    });

    it("should call xxx function", ()=>{
        
        userController.register(req, res, next);
        expect(userController.register).toBeCalled();
    })

    it("should return 200 response code", ()=>{
        
        userController.register(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();

    });
    it("should return json body", ()=>{
        
        userController.register(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();

    })
});
