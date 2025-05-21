# Documentación del Frontend

**1**. Descripción del frontend
   
   Frontend de una SPA (Single Page Application) desarrollada en React para la gestión de reservas en una peluquería/barbería. Incluye autenticación por roles, gestión de citas, disponibilidad, perfiles de usuario y páginas legales.

**2**. Estructura de carpetas
```
   src/
    ├── components/      # Reutilizables: Navbar, Formularios, Calendarios
    ├── context/         # Contexto global para auth
    ├── dashboard/       # Paneles por tipo de usuario 
    ├── pages/           # Páginas principales (Login, Home, Dashboard, etc)
    ├── services/        # Comunicación con backend vía axios
    ├── utils/           # Utilidades 
    ├── App.jsx          # Componente raíz y configuración de rutas
    ├── main.jsx         # Punto de entrada de la app
```

**3**. gestión de estados

- ``AuthContext.jsx``: mantiene el estado global del usuario autenticado (token, datos, rol).
- Los roles definidos son: ``cliente``, ``trabajador``, ``admin``, ``superadmin``.
    

**4**. Rutas protegidas 

- ``ProtectedRoute.jsx``: protege rutas según rol y redirige si no hay acceso.
- Aplicado a dashboards, reservas, y paneles de administración.

**5**. Rutas principales

Manejadas en ``App.jsx``:

- ``/`` – Página de inicio (``WelcomePage``).
- ``/login``, ``/register``, ``/verify-email``.
- ``/dashboard ``– Accede al dashboard según el rol.
- ``/booking`` – Página para hacer una reserva.
- ``/legal``, ``/privacy``, ``/terms``, ``/cookies`` – Páginas legales.

**6**. Comunicación con el Backend

Los servicios (`/src/services`) encapsulan las peticiones `axios`:

```js
// authService.js
const api = axios.create({
  baseURL: 'https://tfcdomain.online', 
  withCredentials: true, // permite enviar cookies
});

export const login = async ({ email, password }) => {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data; 
  } catch (err)
```

Servicios:

- ``authService.js`` – Login, register, logout, etc.
- ``bookingService.js`` – Reservas (crear, obtener, cancelar).
- ``serviceService.js`` – Servicios de peluquería.
- ``userService.js`` – Usuarios y perfiles.

**7**. Gestión de Citas y Disponibilidad

- ``BookingPage.jsx``: selector de servicio, trabajador y horario.
- ``AvailabilityManager.jsx`` y ``UnavailableDaysManager.jsx``: gestión de disponibilidad y días bloqueados por el trabajador.
- ``MyReservations.jsx`` y ``ClientReservations.jsx``: historial de reservas.

**8**. Paneles de Usuario

Cada rol tiene su propio **dashboard** (panel):

- ``SuperAdminDashboard.jsx``: Gestiona todo.
- ``AdminDashboard.jsx``: Gestión de trabajadores y servicios.
- ``WorkerDashboard.jsx:`` Citas, horarios, perfil.
- ``ClientDashboard.jsx``: Perfil y reservas.

**9**. Paginas legales y cookies

- ``Cookies.jsx`` + ``CookieBanner.jsx``: Banner con aceptación y gestión de cookies.
- ``LegalPage``, ``Privacy``, ``Terms``: Páginas legales informativas.

**10**. Diseño

- Usa CSS (``.module.css``) por componente.
- Paleta de colores base: #FFFFFF, #D5D2C8, #000000, #FAF3E9, #ACA8A3, #2D2D2D, #FF7648
- Tipografía: ``Canela Bold``, ``Playfair Display``, ``Inter``
- Tendencia: **Minimalista**

Ejemplo:

![Ejemplo](/frontend/images/home.png)

**11**. ▶️ Ejecución
```bash
npm install

npm run start:frontend
```