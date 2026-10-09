export const validate = (schema, source = "body") => {

  return (req, res, next) => {

    // Obtener los datos que queremos validar
    const data = req[source];

    // Ejecutar la validación
    const result = schema.safeParse(data);

    // Si los datos son inválidos
    if (!result.success) {

      return res.status(400).json({
        error: "Datos inválidos",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });

    }

    // Conservar los datos validados
    // En Express 5, req.query y req.params pueden tener
    // propiedades especiales; no necesitamos reemplazarlas.
    if (source === "body") {
      req.body = result.data;
    }

    // Continuar con el siguiente middleware
    next();

  };

};