require('dotenv').config(); //configure the app to use .env files
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

app.use(require('./middleware/headers'));

app.use(Express.json());

const controllers = require("./controllers");

app.use("/user", controllers.usercontroller);
app.use("/log", controllers.logcontroller);

dbConnection.authenticate()
    .then(() => dbConnection.sync()) // =>(force:true)
    .then(() => {
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}.`);
    });
