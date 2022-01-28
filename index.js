const { Router } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Import routes

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => console.log("connected to db!"));

//Middleware
app.use(express.json());

//Route Middleware
app.use("", authRoute);
app.use("", userRoute);
app.listen(3000, () => console.log("le server marche bien "));
