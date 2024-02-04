const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')
const db = require('./database/db_config');

// MODELS 
const User = require('./models/user_models');

const app = express();
require('dotenv').config();

// PORT
const PORT = process.env.PORT | 3030;

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// SIMPLE API 
app.get('/', (req, res, next) => {
    res.json({
        message: "API's Working!"
    });
});

// ROUTES
require('./routes/authUserRoutes')(app);
require('./routes/userRoutes')(app);

// LISTENING PORT
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})