const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks= new Promise((resolve, reject)=>{
        if(books){
            resolve(books);
        }else{
            reject("Books not available");
        }
    })
    getBooks
    .then((booksdata)=>{
        res.status(200).json(booksdata);
    })
    .catch((err)=>{
        res.status(403).json({message :"error"});
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const getBook = new Promise((resolve, reject)=>{
        if(books[isbn]){
            resolve(books[isbn]);
        }else{
            reject("Book not found");
        }
    })
    getBook
    .then((booksData)=>{
        res.status(200).json(booksData);
    })
    .catch((err)=>{
        res.status(403).json({message: "error"});
    })
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorParam = req.params.author.trim().toLowerCase();
  
    const findBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = [];
  
      for (let isbn in books) {
        const bookAuthor = books[isbn].author.trim().toLowerCase();
        if (bookAuthor === authorParam) {
          matchingBooks.push({ isbn, ...books[isbn] });
        }
      }
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("Author not found");
      }
    });
  
    findBooksByAuthor
      .then((booksByAuthor) => {
        res.status(200).json(booksByAuthor);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  });
  
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.trim().toLowerCase();
  
    const findBooksByTitle = new Promise((resolve, reject) => {
      const matchingBooks = [];
  
      for (let isbn in books) {
        const bookTitle = books[isbn].title.trim().toLowerCase();
        if (bookTitle === titleParam) {
          matchingBooks.push({ isbn, ...books[isbn] });
        }
      }
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("Title not found");
      }
    });
  
    findBooksByTitle
      .then((booksByTitle) => {
        res.status(200).json(booksByTitle);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
        const isbn = req.params.isbn;
        res.send(books[isbn].reviews);     
});

module.exports.general = public_users;
