const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()

const apiroute = require('./routes/apiroute.js');

const app = express();
//console.log(process.env) // remove this after you've confirmed it is working
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});

const PORT = process.env.PORT;
const dbUri = process.env.DATABASE_CONNECTION_URL;
async function connectDB() {
  mongoose.connect(dbUri,
    (err) => {
      if (err) {
        console.log(">>>>> Database Connection Failed: " + err)
      } else {
        console.log(">>>>>> Successfully connected to database !!!")
        const server = app.listen(PORT, () => {
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





