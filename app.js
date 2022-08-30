const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const Blog = require('./models/blog');

//create instance of express server
const app = express(); 
//connect to mongodb
const dbURL = 'mongodb+srv://habeeb:test1234@nodetuts.wmv56ho.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((error) => console.log(error)) 
//create port to listen to request
//app.listen(5000);

app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'Secong blog',
        snippet: 'Blog header',
        body: 'This blog talks about Science'
    });
    blog.save().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(404).send('404 - No response');
    })
   
});

//Homepage route
app.get('/', (req, res) => {
    res.send('Welcome to home page');
    res.redirect('/blogs')
});


//return all blogs in the database and sort them in ascending order
app.get('/blogs',(req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.send(result)
        })
        .catch((error) =>{ 
            console.log(error)
        })
});

//create a blog ans sae it in the database
app.post('/blog', (req, res) => {
    console.log(req.body);
    const blog = new Blog(req.body);
    blog.save().then((result) => {
        res.send('Blog saved successfully')
    }).catch((error) => {
        res.status(404).send('Blog failed to save')
    })
});

//Search blog by id to view more detail about the blog
app.get('blog/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id).then((result) => {
        res.send(result).catch((error) => {
            res.status(404).send('Blog does not exist');
        })
    })
});

//Search blog by id to view more detail about the blog
app.delete('blog/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findByIdAndDelete(id).then((result) => {
        //res.send('Bolg was deleted successfully')
        res.json({redirect: '/blog'})
        .catch((error) => {
            res.status(404).send('Blog does not exist');
        })
    })
})

app.get('/about', (req, res) => {
    res.send('Welcome to about page');
});

app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

app.get('/create-blog', (req, res) => {
    res.send('Welcome to about page');
});

app.use((req, res) => { 
    res.status(404).send('404 - page not found');
});
