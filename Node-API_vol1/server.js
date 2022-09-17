
const http = require('http');

const server = http.createServer((req, res) => {
    console.log("request made");

    //set header contenct type
    res.setHeader('Content-Type', 'text/plain');
    //let path = "/resources/"
    switch(req.url){ 
        case '/':
            res.statusCode = 200;
            res.write("Welcome to home page");        
            res.end();
        break;
        case '/home':
            res.statusCode = 301;
            res.setHeader("Location",'/');        
            res.end();
        break;
        case '/about':
            res.statusCode = 200;
            res.write("Welcome about page");
            res.end();
        break;
        default:
            res.statusCode = 404;
            res.write("page does not exist");
            res.end();
           
        break;
    }
    // res.write('Hello, Welcome to my first API')
    // res.end();
});

server.listen(5000, 'localhost', () => {
    console.log("listening for request on port 5000");
})