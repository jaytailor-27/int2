const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    producer: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    screen: { type: String, required: true },
    file: { type: String, required: true } 
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
