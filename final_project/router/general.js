const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorParam = req.params.author.trim().toLowerCase(); // remove spaces, case-insensitive
    const matchingBooks = [];
  
    for (let isbn in books) {
      const bookAuthor = books[isbn].author.trim().toLowerCase();
      if (bookAuthor === authorParam) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "Author not found" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title.trim().toLowerCase();
   const matchingBooks = [];

   for(let isbn in books){
    const booktitle = books[isbn].title.trim().toLowerCase();
    if(booktitle === title){
        matchingBooks.push({isbn, ...books[isbn]});
    }
   }
   if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
        const isbn = req.params.isbn;
        res.send(books[isbn].reviews);     
});

module.exports.general = public_users;
