 const express = require('express');
const { Result } = require('express-validator');
      passport = require('passport');
      mongoose = require('mongoose');
      alert = require('alert');
app=express();
      passport = require('passport');
      bodyParser = require('body-parser');
      LocalStrategy = require('passport-local');
      passportLocalMongoose = require('passport-local-mongoose');
      User =  require("./models/user");
// Connecting to database
mongoose.connect('mongodb+srv://ganeshdb:root@cluster0.yt3zl.mongodb.net/konnekt?retryWrites=true&w=majority');
      app.use(require("express-session") ({
          secret:"Any normal Word",//decode or encode session
          resave: false,          
          saveUninitialized:false   
      }));
var Schema = mongoose.Schema;
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
var fs = require('fs');
var path = require('path');
require('dotenv/config');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

//routes


app.get('/', (req, res) => {
    res.render("index");
})


app.post("/", passport.authenticate("local", {
    successRedirect:"/marketplace",
    failureRedirect:"/",
}),function(req, res) {
});


app.get('/register', (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    User.register(new User ({
        username: req.body.username,
        phone: req.body.phone,
        password:req.body.password,
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


var ItemSchema = new mongoose.Schema({
    user: String,
    name: String,
    mno: String,
    originalprice: String,
    finalprice: String,
    description: String,
    types: {
        type: String,
        enum: ['Books', 'Apron', 'Tools', 'Electronics'],
    },
    img:
    {
        data: Buffer,
        contentType: String
    }
  },
  {
      collection : 'books'
  });
  var itemsModel = mongoose.model("items", ItemSchema);
app.post("/additems", upload.single('image'), (req, res) => {
    const saveItem = new itemsModel({
        user: req.body.user,
        name: req.body.name,
        mno: req.body.mno,
        originalprice: req.body.price,
        finalprice: req.body.pricel,
        description: req.body.desc,
        types: req.body.sel1,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    saveItem.save().then(
        () => {
            res.redirect("/books");
        }
      ).catch(
        (error) => {
          res.render("additems");
        }
      );
})

app.get('/books', (req, res)=> {
    var noMatch = null;
    if(req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        itemsModel.find({name: regex}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              if(allbooks.length < 1) {
                  noMatch = "No product match,the query";
              }
              res.render("books",{books:allbooks, noMatch: noMatch});
           }
        });
    } 
    else {
        itemsModel.find({}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              res.render("books",{books:allbooks, noMatch: noMatch});
           }
        });
    }
});

app.get('/apron', (req, res)=> {
    var noMatch = null;
    if(req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        itemsModel.find({name: regex}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              if(allbooks.length < 1) {
                  noMatch = "No product match,the query";
              }
              res.render("apron",{books:allbooks, noMatch: noMatch});
           }
        });
    } 
    else {
        itemsModel.find({}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              res.render("apron",{books:allbooks, noMatch: noMatch});
           }
        });
    }
});


app.get('/marketplace', (req, res)=> {
    var noMatch = null;
    if(req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        itemsModel.find({name: regex}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              if(allbooks.length < 1) {
                  noMatch = "No product match,the query";
              }
              res.render("marketplace",{books:allbooks, noMatch: noMatch});
           }
        });
    } 
    else {
        itemsModel.find({}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              res.render("marketplace",{books:allbooks, noMatch: noMatch});
           }
        });
    }
});


app.get('/electronics', (req, res)=> {
    var noMatch = null;
    if(req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        itemsModel.find({name: regex}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              if(allbooks.length < 1) {
                  noMatch = "No product match,the query";
              }
              res.render("electronics",{books:allbooks, noMatch: noMatch});
           }
        });
    } 
    else {
        itemsModel.find({}, function(err, allbooks){
           if(err){
               console.log(err);
           } else {
              res.render("electronics",{books:allbooks, noMatch: noMatch});
           }
        });
    }
});
app.get('/myitems', (req, res) => {
    itemsModel.find({}, function (err, allbooks) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("myitems", {books: allbooks});
        }
    })
})

app.post ('/deleteitems', function(req,res) {
    const deleteItem = itemsModel.findOne({name: req.body.iname});
    deleteItem.remove().then(
        () => {
            res.redirect("/books");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
})

var schema = new mongoose.Schema({
    event_name : String,
    event_date : String,
    event_desc:String,
    registration_end_date : String,
    registration_link : String,
    event_status :String
  },
  {
      collection : 'presentevents'
  });
  
  var pdetailsModel = mongoose.model("pevents", schema);
  app.get("/events", function (req, res) {   
  pdetailsModel.find({}, function (err, allpevents) {
      if (err) {
          console.log(err);
      } 
      else {
          res.render("events", { pevents: allpevents })
      }
  })
  })

  app.post("/addevents", (req, res) => {
    const saveEvents = new pdetailsModel({
        event_name : req.body.eventname,
        event_date : req.body.date,
        event_desc:req.body.desc,
        registration_end_date : req.body.enddate,
        registration_link : req.body.link,
        event_status :req.body.status,
    });
    saveEvents.save().then(
        () => {
            res.redirect("/events");
        }
      ).catch(
        (error) => {
          res.render("addevents");
        }
      );
    
  })

  /*app.put('/updateevents', (req, res) => {
    pdetailsModel.findOneAndUpdate ({name: "IDEATHON"},
        {event_status: '2'}), null, function (err, docs) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("Result",docs);
            }
        }
    
  })*/

  app.post ('/deleteevents', function(req,res) {

    const deleteEvents = pdetailsModel.findOne({event_name: req.body.eventname1});
    deleteEvents.remove().then(
        () => {
            res.redirect("/events");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})

app.post('/updateevents', function(req, res) {

    const updateEvents = pdetailsModel.findOne({event_name: req.body.eventname2});
    updateEvents.update(updateEvents, { $set: {event_status: req.body.status2}}).then(
        () => {
            res.redirect("/events");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})


var pastSchema = new mongoose.Schema({
    event_name : String,
    event_date : String,
    event_desc:String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    
  },
  {
      collection : 'pastevents'
  });
  
  var pastModel = mongoose.model("events", pastSchema);
  app.get("/pastevents", function (req, res) {   
  pastModel.find({}, function (err, allevents) {
      if (err) {
          console.log(err);
      } 
      else {
          res.render("pastevents", { events: allevents })
      }
  })
  })

  app.post("/addpastevents", upload.single('image'), (req, res) => {

    const saveEvents = new pastModel({
        event_name : req.body.eventname,
        event_date : req.body.date,
        event_desc:req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }  
    });
    saveEvents.save().then(
        () => {
            res.redirect("/pastevents");
        }
      ).catch(
        (error) => {
          res.render("addpastevents");
        }
      );
  })


  app.post ('/delpast', function(req,res) {

    const deleteevents = pastModel.findOne({event_name: req.body.eventname1});
    deleteevents.remove().then(
        () => {
            res.redirect("/pastevents");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})

app.post('/uppast', function(req, res) {

    const updateEvents = pastModel.findOne({event_name: req.body.eventname2});
    updateEvents.update(updateEvents, { $set: {event_status: req.body.status2}}).then(
        () => {
            res.redirect("/pastevents");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})


  app.get("/addevents", (req, res) =>{
      res.render("addevents");
  })

  app.get("/forum", (req, res) =>{
    res.render("forum");
})

app.get("/addpastevents", (req, res) => {
    res.render("addpastevents");
})


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


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
app.listen(process.env.PORT || 3000, function (err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Server started at 3000");
    }
})