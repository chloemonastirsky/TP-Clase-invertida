const validate = (schema) => (req, res, next) => {
  try {
    // Valida que el req.body cumpla con la estructura del esquema Zod
    schema.parse(req.body);
    next();
  } catch (error) {
    // Retorna error 400 Bad Request si la información es inválida
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      detalles: error.errors.map((e) => ({
        campo: e.path.join('.'),
        mensaje: e.message
      }))
    });
  }
};

module.exports = validate;