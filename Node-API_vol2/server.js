const express = require("express")
const helmet = require("helmet");
const mongoose = require("mongoose")
require('dotenv').config()

const apiroute = require('./routes/apiroute.js');

const service = express();

service.use(helmet())

const PORT = process.env.PORT;
const dbUri = process.env.DATABASE_CONNECTION_URL;
async function connectDB() {
  mongoose.connect(dbUri,
    (err) => {
      if (err) {
        console.log(">>>>> Database Connection Failed: " + err)
      } else {
        console.log(">>>>>> Successfully connected to database !!!")
        const server = service.listen(PORT, () => {
          const { port } = server.address();
          console.log(`>>>>>> Server running on PORT: ${port}`);
        })
      }
    },
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
}

connectDB()
service.use(express.json({ extended: false }));
service.use('/webservice', apiroute);


///----------- mongodb basic command --------------

// mongosh -> to enter mongo CLI
// show databases -> list all database
// use socialDBMS -> switch to social to socialDBMS. Note yours may be different
// show collections or show tables -> list of all collections created
// db.getCollection(registers).find() OR db.registers.find().pretty() -> retrieve all user in register collection
// db.registers.insertOne({username: "SODIQ", email:"sodQgmail.com", password:"232222"}) -> this insert document in a collection
// db.registers.insertMany(
        // [
          // {username: "SODIQ", email:"sodiqQgmail.com", password:"232222"}, 
          // {username: "SOD", email:"sodQgmail.com", password:"2109807"}
        // ]
      // ) -> this insert documents in many collection



      
///------------ default security helmet --------------------------
// Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
// Cross-Origin-Embedder-Policy: require-corp
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Resource-Policy: same-origin
// Origin-Agent-Cluster: ?1
// Referrer-Policy: no-referrer
// Strict-Transport-Security: max-age=15552000; includeSubDomains
// X-Content-Type-Options: nosniff
// X-DNS-Prefetch-Control: off
// X-Download-Options: noopen
// X-Frame-Options: SAMEORIGIN
// X-Permitted-Cross-Domain-Policies: none
// X-XSS-Protection: 0




