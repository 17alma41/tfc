// Este archivo mapea los roles del backend al frontend y viceversa.
export const roleToPath = {
    superadmin: 'superadmin',
    admin:      'admin',
    encargado:  'admin',
    trabajador: 'worker',
    cliente:    'client'
  };
  
  export const pathToRole = Object.fromEntries(
    Object.entries(roleToPath).map(([backend, frontend]) => [frontend, backend])
  );
  