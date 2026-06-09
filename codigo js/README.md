# Práctica con Node.js — Sistema de Autenticación con JWT

Sistema de autenticación con **Node.js, Express, bcrypt y JSON Web Tokens (JWT)**,
con gestión de roles (Admin/User), middleware de protección de rutas y vistas EJS.

## Características
- Registro e inicio de sesión de usuarios.
- Contraseñas encriptadas con bcrypt (SALT_ROUND = 12).
- Sesiones mediante JWT almacenado en cookie httpOnly.
- El primer usuario registrado obtiene el rol **admin**; los demás, **user**.
- Ruta protegida `/protected` con panel diferenciado por rol.
- Validaciones de usuario y contraseña en español.

## Estructura
```
clase-7/
├── views/
│   ├── index.ejs        # Login / registro y panel de bienvenida
│   └── protected.ejs    # Panel de control protegido (vista admin)
├── config.js            # Puerto, salt y llave secreta JWT
├── index.js             # Servidor: rutas y middleware
├── user-repository.js   # Persistencia, validaciones y roles
└── package.json
```

## Instalación y ejecución
```bash
cd clase-7
npm install
npm run dev      # modo desarrollo (node --watch)
# o
npm start
```
Luego abrir http://localhost:3000 en el navegador.

## Tecnologías
express · bcrypt · jsonwebtoken · cookie-parser · db-local · ejs

Referencia: midulive (2024). *Aprende Autenticación de Usuario, Sesión, Cookies y JWT con Node.js*. https://www.youtube.com/watch?v=UqnnhAZxRac
