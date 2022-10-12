const express = require("express")
const mongoose = require("mongoose")
// const Register = require('./models/register');
//const jwt = require('jsonwebtoken');
const apiroute = require('./routes/apiroute.js');

const app = express();

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});
const dbUri = 'mongodb://localhost:27017/selfdb';
async function connectDB() {
    mongoose.connect(dbUri,
        (err) => {
            if (err) {
                console.log(">>>>> database connection Failed: " + err)
            } else {
                console.log(">>>>>> Successfully connected to database !!!")
                //app.listen(5000, () => console.log(">>>>>>>>>>> Listening on port 5000 !!!"))
                const server = app.listen(process.env.PORT || 5000, () => {
                      const { port } = server.address();
                      console.log(`>>>>>> Server running on PORT: ${port}`);
                    })
            }
        },
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
}

connectDB()
app.use(express.json({ extended: false }));
app.use('/webservice', apiroute);


///------------ CSP API --------------------------
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();

// app.use(function (req, res, next) {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
//   );
//   next();
// });

// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname)));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });

// const server = app.listen(process.env.PORT || 5500, () => {
//   const { port } = server.address();
//   console.log(`Server running on PORT ${port}`);
// });





