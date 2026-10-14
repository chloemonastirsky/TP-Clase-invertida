const express = require('express');
const { z } = require('zod');
const validate = require('./middlewares/validate');

const app = express();
app.use(express.json());

// Base de datos simulada en memoria
const productosDB = [
  { id: 1, nombre: 'Teclado Mecánico', precio: 85.5 }
];

// Esquema de validación para la creación de un producto
const productoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  precio: z.number().positive('El precio debe ser un número positivo')
});

// GET /api/productos - Obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.status(200).json(productosDB);
});

// GET /api/productos/:id - Obtener producto por ID (con manejo de 404)
app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const producto = productosDB.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.status(200).json(producto);
});

// POST /api/productos - Crear un producto (con validación de payload)
app.post('/api/productos', validate(productoSchema), (req, res) => {
  const nuevoProducto = {
    id: productosDB.length + 1,
    nombre: req.body.nombre,
    precio: req.body.precio
  };

  productosDB.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// Middleware global de manejo de errores no capturados (Evita el crash de Node.js)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;