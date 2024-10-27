const express = require('express');
const multer = require('multer');
const Movie = require('../models/Movie');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Login route
router.get('/login', (req, res) => {
    res.render('login'); // Assuming you have a 'login.ejs' file in 'views'
});

// Process login
router.post('/login', (req, res) => {
    req.session.user = { username: req.body.username };
    res.redirect('/add-movie');
});

// Render add-movie page
router.get('/add-movie', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('addMovie');
});

// Handle movie addition
router.post('/add-movie', upload.single('movieFile'), (req, res) => {
    const { name, producer, price, date, screen } = req.body;
    const newMovie = new Movie({
        name,
        producer,
        price,
        date,
        screen,
        file: req.file.filename,
    });
    newMovie.save()
        .then(() => res.redirect('/list-movies'))
        .catch(err => console.log(err));
});

// List movies
router.get('/list-movies', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    Movie.find()
        .then(movies => res.render('listMovies', { movies }))
        .catch(err => console.log(err));
});

// Delete movie
router.post('/delete-movie/:id', (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/list-movies'))
        .catch(err => console.log(err));
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.redirect('/list-movies');
        }
        res.redirect('/login');
    });
});

module.exports = router;
