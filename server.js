// checks to see if development dependencies are required or not
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// getting the required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/passport")(passport);

// database connection
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        // listening for requests
        app.listen(process.env.PORT || 3000);
        console.log("Connected to Mongoose");
    })
    .catch((err) => {
        console.log("Error connecting to Mongoose");
        console.log(err);
    });

// setting up ejs
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.set("card-decks", "/");
app.set(expressLayouts);

// bodyparser
app.use(
    express.urlencoded({
        extended: false,
    })
);

// express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// using the flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// getting the routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));