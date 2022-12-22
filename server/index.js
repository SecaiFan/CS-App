require('dotenv').config();
console.log(require('crypto').randomBytes(64).toString('hex'));
const express = require('express');
const sequelize = require('./DB');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT ?? 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_KEY));

app.use('/api', router);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

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
