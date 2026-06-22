
# ControlTaco

ControlTaco es un MVP web para administrar operaciones basicas de un restaurante: login, dashboard, mesas, pedidos, inventario y ventas. El proyecto esta organizado como monorepo con frontend y backend separados.

## Stack del proyectoo

- Frontend: React + Vite + TypeScript.
- Estilos: CSS moderno sin framework UI.
- Backend: Node.js + Express + TypeScript.
- Base de datos backend: MongoDB con Mongoose.
- Pruebas backend: Vitest.
- Datos demo del frontend: `localStorage` del navegador.

> Nota: aunque la idea inicial hablaba de PostgreSQL/Prisma, este MVP actualmente esta implementado con MongoDB/Mongoose en el backend y persistencia local en el frontend para las funciones demo.

## Estructura

```txt
controltaco/
  backend/
    src/
      config/          Conexion a MongoDB
      controllers/     Logica de rutas API
      models/          Modelos Mongoose
      routes/          Rutas Express
      utils/           Funciones probadas con Vitest
  frontend/
    src/
      data/            Store local del MVP
      layouts/         Layout con sidebar
      pages/           Dashboard, Mesas, Inventario, Ventas, Login
```

## Requisitos

- Node.js instalado.
- npm instalado.
- MongoDB opcional para backend. Si no hay `MONGO_URI`, el backend puede iniciar en modo demo para algunas rutas.

## Como iniciar el proyecto

Abre dos terminales desde la carpeta raiz `controltaco`.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Servidor backend:

```txt
http://localhost:5000
```

Ruta de prueba:

```txt
http://localhost:5000/api/health
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicacion web:

```txt
http://127.0.0.1:5173/
```

## Login

El login actual es demo. Puedes escribir cualquier correo y contrasena para entrar. Al iniciar sesion se guarda esta marca en `localStorage`:

```txt
controltaco_session = active
```

Las rutas internas estan protegidas. Si no existe esa sesion, el sistema redirige a `/login`.

Para salir, usa el boton `Cerrar Sesion` del sidebar. Este elimina la sesion local y regresa al login.

## Logica principal del MVP

### Mesas

La pantalla de Mesas permite:

- Crear mesas con numero y capacidad.
- Eliminar mesas.
- Cambiar estado: `Disponible`, `Ocupada`, `Reservada`.
- Tomar pedido seleccionando productos del inventario.
- Cobrar pedido y registrar la venta.

Cuando se cobra un pedido:

- Se crea una venta.
- Se descuenta stock de los productos vendidos.
- La mesa vuelve a estado `Disponible`.
- La venta aparece en Ventas y en la grafica del Dashboard.

### Inventario

La pantalla de Inventario permite:

- Agregar productos con nombre, categoria, precio y stock.
- Eliminar productos.
- Usar esos productos en la toma de pedidos de Mesas.

El stock se actualiza automaticamente cuando se cobra un pedido desde Mesas.

### Ventas

La pantalla de Ventas permite:

- Ver ventas registradas desde Mesas.
- Registrar ventas manuales.
- Eliminar ventas.
- Exportar un reporte CSV.

### Dashboard

El Dashboard calcula sus metricas desde las ventas guardadas:

- Ventas de hoy.
- Numero de ordenes del dia.
- Numero de mesas registradas.
- Ticket promedio.
- Grafica de ventas semanales.

## Persistencia de datos

El frontend guarda los datos demo en `localStorage`, usando estas claves:

```txt
controltaco_mesas
controltaco_productos
controltaco_ventas
controltaco_session
```

Si quieres reiniciar la demo desde cero, borra el `localStorage` del navegador o usa las herramientas de desarrollador del navegador.

## Comandos utiles

### Frontend

```bash
cd frontend
npm run dev
npm run build
```

### Backend

```bash
cd backend
npm run dev
npm run build
npm test
```

## Pruebas

Actualmente el backend tiene pruebas unitarias para la logica de facturacion:

```bash
cd backend
npm test
```

## Variables de entorno del backend

Puedes crear un archivo `backend/.env` con:

```env
PORT=5000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
```

Si `MONGO_URI` no existe o falla, el backend no debe detener toda la demo. La prioridad del MVP es que el frontend pueda seguir mostrando y usando datos locales.

## Estado actual

Funcionalidades listas en el MVP:

- Login demo con proteccion de rutas.
- Sidebar con cierre de sesion.
- Dashboard con grafica semanal.
- CRUD demo de mesas.
- Toma y cobro de pedidos.
- Inventario demo con productos.
- Registro y exportacion de ventas.
- Backend Express compilable.
- Pruebas backend con Vitest.

Pendientes recomendados para una version final:

- Conectar login real con JWT.
- Guardar Mesas, Productos y Ventas completamente en backend.
- Unificar la fuente de datos para que no dependa de `localStorage`.
- Agregar validaciones mas estrictas y roles de usuario.
- Agregar tickets/facturas y reportes mas avanzados.
=======
# ControlTaco-Restaurant-System
Sistema web de administración de restaurantes desarrollado con React, TypeScript, Node.js, Express y MongoDB. Permite gestionar mesas, pedidos, inventario y ventas mediante una arquitectura full stack moderna.
