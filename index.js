const express = require('express');
const cors = require('cors');
const app = express();

// --- CONFIGURACIÓN ---
app.use(cors());
app.use(express.json());

// --- MIS RUTAS 
// 1. Importa el archivo de rutas (Asegúrate de que el archivo exista en la carpeta /routes)
const rutasPsicologos = require('./routes/psicologos');
const rutasPacientes = require('./routes/pacientes');
const rutasCitas = require('./routes/citas');
const rutasHistorial = require('./routes/historial_clinico');
const rutasFichas = require('./routes/fichas_seguimiento');
const rutasPagos = require('./routes/pagos');
// AGREGA ESTA LÍNEA:
const rutasBlog = require('./routes/blog'); 

// 2. Conecta la ruta con el servidor
app.use('/api/psicologos', rutasPsicologos);
app.use('/api/pacientes', rutasPacientes);
app.use('/api/citas', rutasCitas);
app.use('/api/historial', rutasHistorial);
app.use('/api/fichas', rutasFichas);
app.use('/api/pagos', rutasPagos);
// AGREGA ESTA LÍNEA:
app.use('/api/blog', rutasBlog);
// Ruta raíz
// ... (tus rutas anteriores)

// Ruta raíz que ya te funciona
app.get('/', (req, res) => {
    res.send('Backend de Stars Kids operativo al 100% 🚀');
});

// CAMBIA EL ENCENDIDO POR ESTO:
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor andando en puerto ${PORT}`);
});