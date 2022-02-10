const express = require('express');
const bodyParser= require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const userRoutes = require('./routes/users.route');
const postRoutes = require('./routes/post.route');


app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/posts',postRoutes);



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
    console.log('server running at 127.0.0.1');
});