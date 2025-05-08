import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  name:     Yup.string().required('El nombre es obligatorio'),
  email:    Yup.string().email('Email inválido').required('El email es obligatorio'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria')
});

export const loginSchema = Yup.object().shape({
  email:    Yup.string().email('Email inválido').required('El email es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria')
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La nueva contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});