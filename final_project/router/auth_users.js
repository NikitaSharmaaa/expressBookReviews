const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=> {
        return(user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign(
            { data: password},
            "access", // Secret key as a string
            { expiresIn: 60 * 60 * 60 * 60} // Token expires in 1 hour
        );
        req.session.authorization={accessToken,username};
        return res.status(200).json({message: "User has been logged in!"});
    }else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;

    // Validation
    if (!isbn || !books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required in the query" });
    }

    if (!username) {
        return res.status(401).json({ message: "Unauthorized: user not found in session" });
    }

    // Initialize reviews object if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review under the username
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization?.username;
    const isbn = req.params.isbn;

    if (!username) {
        return res.status(403).json({ message: "User not logged in." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    const book = books[isbn];

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "Review by this user not found." });
    }

    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully." });
});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
