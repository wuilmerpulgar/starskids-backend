const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Traigo mi conexión central

// Ver todos los psicólogos registrados
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM psicologos');
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ error: "No pude traer a los psicólogos" });
    }
});

// Registrar un nuevo psicólogo
router.post('/', async (req, res) => {
    const { nombre, especialidad, correo, clave, telefono, disponibilidad } = req.body;
    try {
        const nuevo = await pool.query(
            'INSERT INTO psicologos (nombre, especialidad, correo, clave, telefono, disponibilidad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombre, especialidad, correo, clave, telefono, disponibilidad]
        );
        res.json(nuevo.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude guardar al psicólogo" });
    }
});

// Editar los datos de un psicólogo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, especialidad, telefono, disponibilidad } = req.body;
    try {
        const actualizado = await pool.query(
            'UPDATE psicologos SET nombre = $1, especialidad = $2, telefono = $3, disponibilidad = $4 WHERE id = $5 RETURNING *',
            [nombre, especialidad, telefono, disponibilidad, id]
        );
        res.json(actualizado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude actualizar los datos" });
    }
});

// Eliminar un psicólogo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM psicologos WHERE id = $1', [id]);
        res.json({ mensaje: "Psicólogo eliminado" });
    } catch (err) {
        res.status(500).json({ error: "No pude borrarlo" });
    }
});

module.exports = router;