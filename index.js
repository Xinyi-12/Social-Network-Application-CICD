const express = require('express');
const bodyParser= require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const auth = require('./authorization');
const expressJWT = require('express-jwt');
const multer = require('multer');
var expressStatsd = require('express-statsd');

const app = express();

app.use(bodyParser.json());
const userRoutes = require('./routes/users.route');
// const postRoutes = require('./routes/post.route');
// app.use(multer().single('file'));

app.use(expressStatsd());
app.use('/healthz',userRoutes);


// app.use(expressJWT({ secret: auth.secretKey}).unless({path: [/^\/v1\/user/,/^\/healthz/] }))

app.use('/v1/user', userRoutes);



// app.use('/posts',postRoutes);


/** Swagger Initialization */
const swaggerOption = {
    swaggerDefinition : (swaggerJsdoc.Option = {
        info: {
            title: 'postApp2',
            description: "API documentation",
            contact: {
                name: "Developer",
            },
            servers: ["http://localhost:3000/"],
        },
    }),
    apis: ["index.js", "./routes/*.js"],
}

const swaggerDocs = swaggerJsdoc(swaggerOption);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// swagger initilztion -End




app.listen('3000',() =>{
    console.log('server running at .....');
});

module.exports = app;


