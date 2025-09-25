const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const { movieValidation } = require('../validations/movie');

exports.getAllMovies = async (req, res) => {
  try {
    const { 
      genre, 
      year, 
      rating, 
      director, 
      search, 
      language,
      limit = 10, 
      page = 1,
      sort = '-createdAt'
    } = req.query;
    
    let query = {};
    
    // Filtros
    if (genre) {
      const genreDoc = await Genre.findOne({ name: { $regex: genre, $options: 'i' } });
      if (genreDoc) {
        query.genres = genreDoc._id;
      }
    }
    if (year) query.releaseYear = year;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (director) query.director = { $regex: director, $options: 'i' };
    if (language) query.language = { $regex: language, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const movies = await Movie.find(query)
      .populate('genres', 'name description')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sort);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: movies.length,
        totalMovies: total
      },
      filters: {
        genre, year, rating, director, search, language
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo películas' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('genres');
    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    res.json(movie);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: 'Error obteniendo película' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { error } = movieValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const movie = new Movie(req.body);
    await movie.save();
    await movie.populate('genres');

    res.status(201).json({
      message: 'Película creada exitosamente',
      movie
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error creando película' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { error } = movieValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('genres');

    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    res.json({
      message: 'Película actualizada exitosamente',
      movie
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error actualizando película' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    res.json({ message: 'Película eliminada exitosamente' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: 'Error eliminando película' });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          averageDuration: { $avg: '$duration' },
          totalBudget: { $sum: '$budget' },
          totalBoxOffice: { $sum: '$boxOffice' }
        }
      }
    ]);

    const yearStats = await Movie.aggregate([
      {
        $group: {
          _id: '$releaseYear',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      general: stats[0] || {},
      byYear: yearStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
};