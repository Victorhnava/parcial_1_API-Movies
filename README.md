# Movies API - Examen Parcial 1

## Información del Proyecto

- **Estudiante:** [Tu Nombre y Apellido]
- **Materia:** Aplicaciones Híbridas
- **Docente:** [Nombre del Docente]
- **Comisión:** [Tu Comisión]

## Descripción

API RESTful para la gestión de una biblioteca de películas y directores. La aplicación permite realizar operaciones CRUD completas, autenticación con JWT, filtrado avanzado y búsqueda por nombre.

## Características Principales

**Autenticación JWT** - Sistema completo de registro y login
**Dos rutas principales** - Movies y Directors (más la ruta de usuarios)
**CRUD completo** - Crear, leer, actualizar y eliminar
**Filtrado avanzado** - Por género, año, rating, nacionalidad
**Búsqueda por nombre** - En ambas rutas principales
 **Validaciones robustas** - Usando Joi
**Relaciones entre modelos** - Películas vinculadas a directores
**Paginación** - Para mejor rendimiento
 **Roles de usuario** - Admin y usuario regular

## Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JSON Web Tokens (JWT)
- **Validación:** Joi
- **Encriptación:** bcryptjs
- **CORS:** Habilitado para peticiones cross-origin

## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd movies-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/movies_db
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h
```

### 4. Ejecutar la aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
movies-api/
├── controllers/
│   ├── authController.js      # Lógica de autenticación
│   ├── movieController.js     # Lógica de películas
│   └── directorController.js  # Lógica de directores
├── middleware/
│   └── auth.js               # Middleware de autenticación
├── models/
│   ├── User.js               # Modelo de usuario
│   ├── Movie.js              # Modelo de película
│   └── Director.js           # Modelo de director
├── routes/
│   ├── auth.js               # Rutas de autenticación
│   ├── movies.js             # Rutas de películas
│   └── directors.js          # Rutas de directores
├── validations/
│   ├── auth.js               # Validaciones de autenticación
│   ├── movie.js              # Validaciones de películas
│   └── director.js           # Validaciones de directores
├── public/
│   └── index.html            # Página principal con documentación
├── .env                      # Variables de entorno
├── server.js                 # Archivo principal del servidor
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

## Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### 🎬 Películas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/movies` | Obtener todas las películas | No |
| GET | `/api/movies/:id` | Obtener película por ID | No |
| POST | `/api/movies` | Crear nueva película | Admin |
| PUT | `/api/movies/:id` | Actualizar película | Admin |
| DELETE | `/api/movies/:id` | Eliminar película | Admin |

**Filtros disponibles para GET /api/movies:**
- `?genre=Action` - Filtrar por género
- `?year=2023` - Filtrar por año
- `?rating=8` - Películas con rating ≥ valor
- `?search=batman` - Buscar por título
- `?page=1&limit=10` - Paginación

### 🎪 Directores

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/directors` | Obtener todos los directores | No |
| GET | `/api/directors/:id` | Obtener director por ID | No |
| POST | `/api/directors` | Crear nuevo director | Admin |
| PUT | `/api/directors/:id` | Actualizar director | Admin |
| DELETE | `/api/directors/:id` | Eliminar director | Admin |

**Filtros disponibles para GET /api/directors:**
- `?nationality=American` - Filtrar por nacionalidad
- `?search=spielberg` - Buscar por nombre
- `?page=1&limit=10` - Paginación

## Ejemplos de Uso

### Registro de usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "123456"
  }'
```

### Crear una película
```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu_token]" \
  -d '{
    "title": "The Dark Knight",
    "director": "[director_id]",
    "releaseYear": 2008,
    "genre": ["Action", "Drama"],
    "duration": 152,
    "rating": 9.0,
    "description": "Batman raises the stakes in his war on crime."
  }'
```

### Buscar películas por género
```bash
curl "http://localhost:3000/api/movies?genre=Action&rating=8"
```

## Modelos de Datos

### Usuario
```javascript
{
  username: String (requerido, único),
  email: String (requerido, único),
  password: String (requerido, encriptado),
  role: String (user/admin)
}
```

### Director
```javascript
{
  name: String (requerido),
  birthDate: Date (requerido),
  nationality: String (requerido),
  biography: String (opcional),
  awards: Array (opcional),
  image: String (URL, opcional)
}
```

### Película
```javascript
{
  title: String (requerido),
  director: ObjectId (referencia a Director),
  releaseYear: Number (requerido),
  genre: Array (requerido),
  duration: Number (requerido),
  rating: Number (0-10),
  description: String (opcional),
  poster: String (URL, opcional),
  budget: Number (opcional),
  boxOffice: Number (opcional)
}
```

## Funcionalidades Implementadas

###  Requisitos Cumplidos

1. **Página Principal:** HTML informativo con documentación completa
2. **Dos rutas principales:** Movies y Directors (más Users)
3. **Funcionalidades requeridas:**
   -  Visualizar todos los documentos
   - Obtener documento por ID
   -  Actualizar información
   - Eliminar documento
   - Dos métodos de filtrado (género/año para movies, nacionalidad para directors)
   - Búsqueda por nombre
4. **Autenticación JWT:** Sistema completo implementado
5. **Validaciones:** Joi para todas las entradas
6. **División de responsabilidades:** Controllers, Models, Routes separados
7. **Uso correcto de módulos:** Estructura modular clara

## Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT para autenticación
- Validación de entrada en todos los endpoints
- Roles de usuario (admin/user)
- Protección contra inyección NoSQL

## Testing

Puedes probar la API usando:
- **Postman** - Importar la colección de endpoints
- **cURL** - Comandos de ejemplo incluidos arriba
- **Navegador** - Para endpoints GET públicos

## Notas de Desarrollo

- La aplicación usa imágenes placeholder para posters y fotos
- Los datos de ejemplo se pueden cargar manualmente o via API
- La base de datos se crea automáticamente al conectar
- Logs detallados para debugging

## Contacto

Para consultas sobre este proyecto, contactar a Victor Nava

---

*Proyecto desarrollado como examen parcial para la materia Aplicaciones Híbridas*
