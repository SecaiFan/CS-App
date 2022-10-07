require('dotenv').config();
const express = require('express');
const sequelize = require('./DB');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const Router = require("express");

const PORT = process.env.PORT ?? 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
const urlEncodedParser = Router.urlencoded({extended: false});

app.set('view engine', 'handlebars')

//Обработка ошибок, замыкающий Middleware
app.use(errorHandler);

const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, function() {console.log(`Server start on Port: ${PORT}`);});
    } catch(error) {
        console.log(error);
    }
};

start();
