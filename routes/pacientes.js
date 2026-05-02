const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// Ver lista de pacientes
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM pacientes');
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al traer los pacientes" });
    }
});

// Registrar un nuevo paciente
router.post('/', async (req, res) => {
    const { nombre_completo, edad, rut, representante_legal, motivo_consulta } = req.body;
    try {
        const nuevo = await pool.query(
            'INSERT INTO pacientes (nombre_completo, edad, rut, representante_legal, motivo_consulta) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre_completo, edad, rut, representante_legal, motivo_consulta]
        );
        res.json(nuevo.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude guardar al paciente" });
    }
});

// Editar datos del paciente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, edad, rut, representante_legal, motivo_consulta } = req.body;
    try {
        const actualizado = await pool.query(
            'UPDATE pacientes SET nombre_completo = $1, edad = $2, rut = $3, representante_legal = $4, motivo_consulta = $5 WHERE id = $6 RETURNING *',
            [nombre_completo, edad, rut, representante_legal, motivo_consulta, id]
        );
        res.json(actualizado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude actualizar al paciente" });
    }
});

// Borrar un paciente
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);
        res.json({ mensaje: "Paciente eliminado" });
    } catch (err) {
        res.status(500).json({ error: "No pude borrar al paciente" });
    }
});

module.exports = router;