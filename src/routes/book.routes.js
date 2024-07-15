const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// MIDDLEWARE
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'El ID del libro no es valido.' });
    }
    try {
        book = await Book.findById(id);
        if(!book) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.book = book;
    next();
}


// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();        
        if (books.length > 0) {
            res.status(204).json([])
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Crear un nuevo libro
router.post('/', async (req, res) => {
    const { books } = req?.body;
    if(!books.title || !books.author || !books.genre || !books.publicationDate){
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const book = new Book(
        {
            title, 
            author, 
            genre,
            publicationDate
        }
    )
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})