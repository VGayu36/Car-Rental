const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const PORT = process.env.PORT ||5050;
const MONGODB_URL = "mongodb+srv://gayathri3600s:sarveshvg16@cluster0.nikj1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
require('dotenv').config();

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log(`Mongodb connected Successfully...`);
    })
    .catch((err) => {
        console.error("Error in connecting to mongodb", err.message);
    });

app.use(express.json());
app.use(cors()); 


const userRoutes = require('./Routes/UserRoutes');
const bookings = require('./Routes/BookingRoutes');
app.use('/api', userRoutes);
app.use('/api',bookings)

const verifyToken = require("./Middleware/AuthMiddleware");


app.get("/unprotected", (req, res) => {
    res.status(200).send("This is an unprotected API");
});


app.get("/protected", verifyToken, (req, res) => {
    res.status(200).send("This is a protected API");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
