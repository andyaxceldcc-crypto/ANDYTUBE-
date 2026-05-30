# ANDYTUBE - Plataforma de Videos Premium

Plataforma de streaming de videos donde solo el administrador sube contenido y los usuarios pagan para verlo.

## Características

- 📤 Panel de administrador para subir videos
- 💰 Sistema de pagos con Stripe
- 🔐 Autenticación de usuarios
- 📺 Reproductor de videos
- 👥 Gestión de usuarios y suscripciones

## Tecnologías

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB
- **Pagos:** Stripe API
- **Storage:** Cloudinary (para videos)

## Estructura del Proyecto

```
ANDYTUBE/
├── backend/          # API Node.js + Express
├── frontend/         # React app
├── docs/            # Documentación
└── README.md
```

## Instalación

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Configuración

Crear archivo `.env` en la carpeta backend con:
```
MONGODB_URI=tu_url_mongodb
STRIPE_SECRET_KEY=tu_clave_stripe
CLOUDINARY_URL=tu_url_cloudinary
JWT_SECRET=tu_secret_jwt
PORT=5000
```

## Uso

1. Crear cuenta de admin
2. Subir videos desde el panel
3. Los usuarios pagan para ver
4. Disfrutar de los ingresos 💰

---
Creado con ❤️ por andyaxceldcc-crypto
