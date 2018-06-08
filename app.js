const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config()
app = express();


 
// app config
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
mongoose.connect(process.env.MONGODB_URI);
// res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// next();

//mongoose blog model 
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

//res.json(blogs);

// restful routes

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
    console.log('options method called')
  });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('middleware called')
    next();
  });
  

app.post("/blogs", function (req, res) {
    Blog.create({
        title: req.body.title,
        image: req.body.image,
        body: req.body.body,
        created: Date.now()
    },
        function (err, blogs) {
            if (err, blogs) {
                if (err) {
                    console.log(`error when adding blog =${err}`)
                    return res.status(500).send("there was a problem adding blog");
                }

                res.status(200).send(blogs);
            }
        });
    });

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) return res.status(500).send("there a problem with retrieveing blogs");
        res.status(200).send(blogs);
    });
});


// FindHelper to show more content of the blog
// showing page for an individual blog - have a button click on "more info"
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) return res.status(500).send("there was a problem retrieving content with id"); {
            res.status(200).send(foundBlog);
        }
    });
});


// Edit route
// Edit title, image and body
// findHelper
// app.patch("/:blogs/id", function (req, res) {
//     Blog.findbyIdAndEdit(req.params.id, function (err, foundBlog) {
//         if (err) return res.status(500).send("there was a problem editing blog"); {
//             res.status(200).send(blog);
//         }
//     });
// });



// Update route
// finding content and updating the content
// findHelper
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body, function (err, updatedBlog) {
        if (err) return res.status(500).send("there was a problem updating the blog"); {
            res.status(200).send(updatedBlog);
        }
    });
});

// Delete route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) return res.status(500).send(" There is an error with deleting the blog"); 
            res.status(200).send("blog was deleted");
    });
});

app.listen(process.env.PORT || 8080, function(){
    console.log("server is running");
})