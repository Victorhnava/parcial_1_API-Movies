const Genre = require('../models/Genre');
const Movie = require('../models/Movie');
const { genreValidation } = require('../validations/genre');

exports.getAllGenres = async (req, res) => {
  try {
    const { search, popularity, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (popularity) {
      query.popularity = { $gte: parseInt(popularity) };
    }

    const skip = (page - 1) * limit;
    
    const genres = await Genre.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ name: 1 });

    const total = await Genre.countDocuments(query);

    res.json({
      genres,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: genres.length,
        totalGenres: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo géneros' });
  }
};

exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: 'Género no encontrado' });
    }

    // Obtener películas del género
    const movies = await Movie.find({ genres: req.params.id })
      .populate('genres', 'name')
      .limit(10);
    
    res.json({
      ...genre.toObject(),
      movies,
      movieCount: await Movie.countDocuments({ genres: req.params.id })
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: 'Error obteniendo género' });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const { error } = genreValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const genre = new Genre(req.body);
    await genre.save();

    res.status(201).json({
      message: 'Género creado exitosamente',
      genre
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El género ya existe' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error creando género' });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const { error } = genreValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!genre) {
      return res.status(404).json({ error: 'Género no encontrado' });
    }

    res.json({
      message: 'Género actualizado exitosamente',
      genre
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El nombre del género ya existe' });
    }
    res.status(500).json({ error: 'Error actualizando género' });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    // Verificar si el género tiene películas asociadas
    const moviesCount = await Movie.countDocuments({ genres: req.params.id });
    if (moviesCount > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el género porque tiene películas asociadas',
        moviesCount 
      });
    }

    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: 'Género no encontrado' });
    }

    res.json({ message: 'Género eliminado exitosamente' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: 'Error eliminando género' });
  }
};