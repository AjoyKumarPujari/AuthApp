//import and load express js
const express = require("express");
const app = express();

//load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;
//cookie  parser - what is this and why we need this

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//middleware to parse json request
app.use(express.json());

require("./config/database").connect();

//routr import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//activation
app.listen(PORT, () => {
    console.log(`App is Listining at ${PORT}`);
})





