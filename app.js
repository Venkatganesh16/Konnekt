const express = require('express');
      passport = require('passport');
      mongoose = require('mongoose');
app=express();
      passport = require('passport');
      bodyParser = require('body-parser');
      LocalStrategy = require('passport-local');
      passportLocalMongoose = require('passport-local-mongoose');
      User =  require("./models/user");
// Connecting to database
      mongoose.connect("mongodb://localhost/konnekt");
      app.use(require("express-session") ({
          secret:"Any normal Word",//decode or encode session
          resave: false,          
          saveUninitialized:false   
      }));
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());
app.use( express.static( "public" ) );
app.use(bodyParser.json());
//routes


app.get('/', (req, res) => {
    res.render("index");
})

app.get('/marketplace', (req, res) => {
    res.render("marketplace");
})

app.get('/books', (req, res) => {
    res.render("books");
})

app.get('/additems', (req, res) => {
    res.render("additems");
})

app.post("/", passport.authenticate("local", {
    successRedirect:"/marketplace",
    failureRedirect:"/"
}),function(req, res) {

});


app.get('/register', (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    User.register(new User ({
        username: req.body.username,
        phone: req.body.phone,
    }),
    req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local") (req, res, function() {
            res.redirect("/");
        })
    })
});

// app.post for /additems to insert the values of name, price and final price

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}
// Listen on Server

app.listen(process.env.PORT || 3000, function (err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Server started at 3000");
    }
})