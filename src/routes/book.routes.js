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
        if (books.length === 0) {
            return res.status(204).json([])
        }
        return res.json(books);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

// Crear un nuevo libro
router.post('/', async (req, res) => {
    const { title, author, genre, publicationDate } = req?.body
    if(!title || !author || !genre || !publicationDate){
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
        return res.status(201).json(newBook);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
})

// Mostrar un libro en especifico

router.get('/:id', getBook, async (req, res) => {
    return res.json(res.book);
})

router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationDate = req.body.publicationDate || book.publicationDate;
        const updatedBook = await book.save();
        return res.json(updatedBook); 
    } catch (error) {
        return res.status(400).json({ message: error.message });        
    }
})

router.patch('/:id', getBook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publicationDate){
        res.status(404).json({
            message: 'Uno de los campos debe ser enviado.'
        })
    }

    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationDate = req.body.publicationDate || book.publicationDate;
        const updatedBook = await book.save();
        return res.json(updatedBook);
    } catch (error) {
        return res.status(400).json({ message: error.message });        
    }
})

router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        return res.json({ message: `El libro ${book.title} fue eliminado correctamente` });
    } catch (error) {
        return res.status(500).json({ message: error.message });        
    }
})

module.exports = router;