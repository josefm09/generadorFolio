# Generador de Folios

Aplicación web para generar y gestionar folios con base de datos SQLite.

## Requisitos Previos

- Node.js (versión recomendada: 18 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd generadorFolio
```

2. Instalar dependencias del servidor:
```bash
npm install
```

3. Instalar dependencias del cliente:
```bash
cd client
npm install
cd ..
```

## Configuración

La aplicación utiliza una base de datos SQLite que se crea automáticamente al iniciar el servidor. No se requiere configuración adicional.

## Ejecución

1. Para ejecutar en modo desarrollo (servidor y cliente simultáneamente):
```bash
npm run dev
```

Esto iniciará:
- Servidor backend en http://localhost:5001
- Cliente frontend en http://localhost:3000

2. Para ejecutar solo el servidor:
```bash
npm run server
```

3. Para ejecutar solo el cliente:
```bash
npm run client
```

## Características

- Generación automática de folios
- Almacenamiento en base de datos SQLite
- Interfaz de usuario moderna con Material-UI
- API RESTful

## Estructura del Proyecto

```
├── client/             # Frontend React
│   ├── public/         # Archivos públicos
│   └── src/            # Código fuente React
├── server.js           # Servidor Express
├── folios.db           # Base de datos SQLite
└── package.json        # Dependencias y scripts
```

## Solución de Problemas

Si encuentras el error "Port already in use":
1. Cierra todas las instancias previas del servidor
2. Verifica que los puertos 3000 y 5001 estén disponibles
3. Reinicia la aplicación con `npm run dev`