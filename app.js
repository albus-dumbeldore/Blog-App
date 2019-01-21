var express     = require("express")
var app         = express()
var bodyParser  = require("body-parser")
var mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost/all_blogs",{useNewUrlParser:true})
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))


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
            res.render("index",{blogs,blogs})
        }
    })
})


app.listen(3000,function(){
    console.log("server has started")
})