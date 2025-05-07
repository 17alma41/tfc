import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  name:     Yup.string().required('El nombre es obligatorio'),
  email:    Yup.string().email('Email inválido').required('El email es obligatorio'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria'),
  role:     Yup.string()
    .oneOf(
      ['cliente','trabajador','encargado','admin','superadmin'],
      'Rol inválido'
    )
    .required('El rol es obligatorio')
});

export const loginSchema = Yup.object().shape({
  email:    Yup.string().email('Email inválido').required('El email es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria')
});
