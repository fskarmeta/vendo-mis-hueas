import Ajv from 'ajv';
import localize_es from 'ajv-i18n/localize/es';

const localeMap = {
  name: 'Nombre',
  email: 'Correo electrónico',
  password: 'Contraseña',
  confirmPassword: 'Confirmar contraseña',
  phone: 'Teléfono',
  address: 'Dirección',
  city: 'Ciudad',
  state: 'Estado',
  zip: 'Código postal',
  country: 'País',
  bio: 'Biografía',
  detail: 'Detalle',
  description: 'Descripción',
  oldPassword: 'Contraseña anterior',
  newPassword: 'Nueva contraseña',
};

export function validateBody(schema) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validate(req.body);
    if (valid) {
      return next();
    } else {
      localize_es(validate.errors);
      const error = validate.errors[0];
      console.log(error);
      return res.status(400).json({
        error: {
          message: `"${
            localeMap[error.instancePath.substring(1)] ||
            error.instancePath.substring(1)
          }" ${error.message}`,
        },
      });
    }
  };
}
