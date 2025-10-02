const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const path = require("path");
const {UserModel,TodoModel} = require("./db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb+srv://kutub:f4wbzvwoYwMX238b@kutub.7jzvxab.mongodb.net/userInfo")
   .then(() => console.log("DB connected"))
   .catch((err) => console.log("DB connection error:", err));

const JWT_SECRET = "ILOVECODDING";

// Signup Route
app.post("/signup", async function(req, res){
    const {username, email, password} = req.body;
    try {
        await UserModel.create({username, email, password});
        res.json({message:"You are successfully signed up"});
    } catch {
        res.status(400).json({message:"User already exists"});
    }
});

// Signin Route
app.post("/signin", async function(req, res){
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email, password});
        if(user){
            const token = jwt.sign({id:user._id.toString()},JWT_SECRET);
            res.json({message:"You are successfully signed in", token});
        } else {
            res.status(400).json({message:"User not found"});
        }
    } catch(err){
        res.status(500).json({message:"Internal server error " + err.message});
    }
});
function auth(req, res, next) {
    // Get the token from the Authorization header
    const token = req.headers.authorization;

    try {
        // Verify the token using the jwt.verify() method
        const decodedData = jwt.verify(token, JWT_SECRET);

        // If the token is valid 
        if (decodedData) {
            // Set the userId in the request object
            req.userId = decodedData.id;

            // Call the next middleware
            next();
        } else {
            // If the token is invalid, send an error message
            res.status(403).json({ message: "Invalid Token!" });
        }
    } catch (error) {
        // Catch any errors in token verification
        res.status(403).json({ message: "Invalid Token!" });
    }
}

app.post("/todo", auth, async function (req, res) {
    // Get the title from the request body
    const { title } = req.body;

    // Get the userId from the request object
    const userId = req.userId;

    try {
        // Create a new todo
        await TodoModel.create({ userId, title });

        // Send a success response
        res.status(201).json({ message: "Todo created!" });
    } catch (error) {
        // Handle potential errors in todo creation
        res.status(500).json({ message: "Error creating todo" });
    }
});

app.listen(3000);


