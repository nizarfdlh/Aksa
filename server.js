const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')

require('dotenv').config();

const PORT = process.env.PORT | 3030;
const db = require('./database/db_config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MODELS 
const User = require('./models/user_models');

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