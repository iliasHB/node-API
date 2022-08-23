const express = require('express')

//create instance of express server
const app = express(); 

//create port to listen to request
app.listen(5000);

app.get('/', (req, res) => {
    res.send('Welcome to home page');
});
app.get('/about', (req, res) => {
    res.send('Welcome to about page');
});

app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

app.use((req, res) => {
    res.send('404 - page not found');
});
