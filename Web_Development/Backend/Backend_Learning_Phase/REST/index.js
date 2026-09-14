const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4 : uuidv4 } = require("uuid");
const { randomUUID } = require("crypto");
uuidv4(); // 'ab16e731-6cee-424d-81a0-5929e9bdb0cc'
const methodOverride = require("method-override");


app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let post = [{
    id : uuidv4(),
    username: "Kuwarji",
    content: "I love stark"
},
{
    id : uuidv4(),      
    username: "Prashant",
    content: "I love food"
},
{
    id : uuidv4(),
    username: "Aaditya",
    content: "I like a film making"
}
]

app.get("/posts", (req, res) => {
    res.render("index.ejs", {
        posts: post
    });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.patch("/posts/:id", (req, res)=>{
    let { id } = req.params;
    let newContent = req.body.content;
    let foundPost = post.find((post)=> post.id === id);
    foundPost.content = newContent;
    console.log(foundPost);
    res.redirect("/posts");
})

app.delete("/posts/:id",(req,res)=>{
    let { id } = req.params;
    post = post.filter((post)=> post.id !== id);
    res.redirect("/posts");
})

app.get("/posts/:id/edit",(req,res)=>{
    let { id } = req.params;
    let foundPost = post.find((post)=> post.id === id);
    res.render("edit.ejs",{post: foundPost});
})


app.post("/posts", (req, res) => {
    let {username, content } = req.body;
    let id = uuidv4();
    post.push({id, username, content });
    // let {id ,username, content } = req.body;
    // post.push({ id, username, content });
    res.redirect("/posts");
    // res.send("Post created successfully");
    console.log(req.body);


    // res.send("Post created successfully");
    // console.log(req.body);
});

app.get("/posts/:id",(req,res)=>{
    let { id } = req.params;
    let foundPost = post.find((post)=> post.id === id);
    res.render("show.ejs",{post: foundPost});
    // console.log(foundPost);
    // console.log(id);
    // res.send("Request Working");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});