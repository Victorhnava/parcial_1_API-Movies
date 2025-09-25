const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const genreRoutes = require('./routes/genres');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Accede a la documentación en: http://localhost:${PORT}`);
});