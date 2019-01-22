var express         = require("express")
var app             = express()
var bodyParser      = require("body-parser")
var mongoose        = require("mongoose")
var methodOverride  = require("method-override")
var sanitizer       = require("express-sanitizer")

mongoose.connect("mongodb://localhost/all_blogs",{useNewUrlParser:true})
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(sanitizer())
app.use(methodOverride("_method"))



var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date , default:Date.now}
})
var Blog = mongoose.model("Blog",blogSchema)
// Blog.create({
//     title:"Test Blog",
//     image:"https://media-cdn.tripadvisor.com/media/photo-s/0c/a5/e7/fd/night-view.jpg",
//     body:"A sky sky full of stars"
// })
app.get("/",function(req,res){
    res.redirect("/blogs")
})
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)console.log("error")
        else{
            res.render("index",{blogs:blogs})
        }
    })
})
app.get("/blogs/new",function(req,res){
    res.render("new")
})

// create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)res.render("new")
        else{
            res.redirect("/blogs")

        }

    })
})
//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)res.redirect("/blogs")
        else{
            res.render("show",{blog:foundBlog})
        }
    })
})

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)res.redirect("/blogs")
        else{
            res.render("edit",{blog:foundBlog})
        }
    })
})

// update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err)res.redirect("/blogs")
        else{

            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//delete route
/*
    app.get("/blogs/:id/delete",function(req,res){
        Blog.findByIdAndRemove(req.params.id,function(err,){
            if(err)res.redirect("/blogs")
            else{
                res.redirect("/blogs")
            }
        })
    })
*/
// delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)res.redirect("/blogs")
        else{
            res.redirect("/blogs")
        }
    })
})

app.listen(4000,function(){
    console.log("server has started")
})