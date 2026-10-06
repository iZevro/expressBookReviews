const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(404).json({ message: "User already exists!" });
  }

  // Add new user to the users array
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(books);
      });
    
      get_books
        .then((bks) => {
          return res.status(200).send(JSON.stringify(bks, null, 4));
        })
        .catch((err) => {
          return res.status(500).json({ message: "Error fetching book list" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const get_book = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  get_book
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message || "Error fetching book" });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const get_books_by_author = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchingBooks = [];

    for (let key of keys) {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "Author not found" });
    }
  });

  get_books_by_author
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message || "Error fetching books" });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const get_books_by_title = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchingBooks = [];

    for (let key of keys) {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  get_books_by_title
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message || "Error fetching books" });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
