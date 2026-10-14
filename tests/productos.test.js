//Suite de pruebas de integración automatizadas (Supertest + Jest)

const request = require('supertest');
const app = require('../src/app');

describe('Suite de Pruebas Automatizadas - API de Productos', () => {

  // --- CASOS EXITOSOS (HAPPY PATH) ---
  describe('GET /api/productos', () => {
    it('Debe responder con Status 200 y la lista inicial de productos', async () => {
      const response = await request(app).get('/api/productos');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/productos', () => {
    it('Debe crear un nuevo producto correctamente y retornar Status 201', async () => {
      const nuevoProducto = { nombre: 'Mouse Inalámbrico', precio: 45.0 };

      const response = await request(app)
        .post('/api/productos')
        .send(nuevoProducto);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nombre).toBe(nuevoProducto.nombre);
      expect(response.body.precio).toBe(nuevoProducto.precio);
    });
  });

  // --- CASOS DE DATOS INVÁLIDOS (400 BAD REQUEST) ---
  describe('Validación de Payloads - POST /api/productos', () => {
    it('Debe rechazar con Status 400 si el precio enviado es un texto en lugar de un número', async () => {
      const payloadInvalido = { nombre: 'Monitor Gamer', precio: 'doscientos' };

      const response = await request(app)
        .post('/api/productos')
        .send(payloadInvalido);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Datos de entrada inválidos');
      expect(response.body.detalles[0].campo).toBe('precio');
    });

    it('Debe rechazar con Status 400 si el nombre del producto es demasiado corto', async () => {
      const payloadInvalido = { nombre: 'NO', precio: 100 };

      const response = await request(app)
        .post('/api/productos')
        .send(payloadInvalido);

      expect(response.statusCode).toBe(400);
      expect(response.body.detalles[0].mensaje).toBe('El nombre debe tener al menos 3 caracteres');
    });
  });

  // --- CASOS DE ERROR (404 NOT FOUND) ---
  describe('GET /api/productos/:id', () => {
    it('Debe retornar Status 404 si se consulta un producto con un ID inexistente', async () => {
      const response = await request(app).get('/api/productos/999');

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });
  });

});