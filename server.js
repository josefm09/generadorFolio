const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
// CORS configuration
const corsOptions = {
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400,
    optionsSuccessStatus: 200
};

// Enable CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Origin:', req.get('origin'));
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
app.use(express.json());

// Crear conexión a la base de datos
const db = new sqlite3.Database('folios.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conexión exitosa con la base de datos SQLite');
        // Crear tabla de folios si no existe
        db.run(`CREATE TABLE IF NOT EXISTS folios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folio TEXT NOT NULL,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            descripcion TEXT
        )`);
    }
});

// Ruta para generar nuevo folio
app.post('/api/folios', (req, res) => {
    const { descripcion } = req.body;
    const fecha = new Date().toISOString();
    const folio = generarFolio(fecha);

    db.run('INSERT INTO folios (folio, descripcion) VALUES (?, ?)',
        [folio, descripcion],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                folio,
                fecha,
                descripcion
            });
        });
});

// Ruta para obtener todos los folios
app.get('/api/folios', (req, res) => {
    console.log('GET /api/folios request received');
    console.log('Origin:', req.get('origin'));
    console.log('Headers:', req.headers);

    db.all('SELECT * FROM folios ORDER BY fecha DESC', [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Sending response with', rows.length, 'folios');
        res.json(rows);
    });
});

// Función para generar folio
function generarFolio(fecha) {
    const fechaObj = new Date(fecha);
    const año = fechaObj.getFullYear().toString();
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const timestamp = fechaObj.getTime().toString().slice(-5);
    return `FOL-${año}${mes}${dia}-${timestamp}`;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('CORS configurado para:', corsOptions.origin);
});