const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  director: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear() + 5
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true
  }],
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  description: {
    type: String,
    maxlength: 1000
  },
  poster: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=Movie+Poster'
  },
  budget: {
    type: Number,
    min: 0
  },
  boxOffice: {
    type: Number,
    min: 0
  },
  language: {
    type: String,
    default: 'English',
    maxlength: 50
  },
  country: {
    type: String,
    maxlength: 100
  },
  awards: [{
    name: String,
    year: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);