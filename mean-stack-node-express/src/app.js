const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
const MONGO_CONNECTION_STRING = "mongodb+srv://" + process.env.MONGO_ATLAS_USER + ":" + process.env.MONGO_ATLAS_PW + "@cluster0.nqhmj.mongodb.net/mean-demo?retryWrites=true&w=majority";
console.log('MONGO_CONNECTION_STRING :' + MONGO_CONNECTION_STRING);
mongoose.connect(MONGO_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection to database failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware: Allow direct access to images folder
app.use("/src/images", express.static(path.join("src/images")));

// Middleware: Allow Cross Origin Requests
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*");
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Referer, Authorization");
    next();
});

// Register the routes
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;