const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ver todas las citas
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT c.id, c.fecha_hora, c.modalidad, c.estado,
                    pa.nombre AS paciente,
                    ps.nombre AS psicologo
             FROM citas c
             JOIN pacientes pa  ON c.paciente_id  = pa.id
             JOIN psicologos ps ON c.psicologo_id = ps.id
             ORDER BY c.fecha_hora DESC`
        );
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ error: "No pude traer las citas" });
    }
});

// Registrar una nueva cita
router.post('/', async (req, res) => {
    const { paciente_id, psicologo_id, fecha_hora, modalidad } = req.body;
    try {
        const nueva = await pool.query(
            `INSERT INTO citas (paciente_id, psicologo_id, fecha_hora, modalidad, estado)
             VALUES ($1, $2, $3, $4, 'pendiente')
             RETURNING *`,
            [paciente_id, psicologo_id, fecha_hora, modalidad]
        );
        res.json(nueva.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude guardar la cita" });
    }
});

// Cambiar estado de la cita
router.patch('/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        const actualizada = await pool.query(
            'UPDATE citas SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );
        res.json(actualizada.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude actualizar el estado" });
    }
});

// Editar cita completa
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { paciente_id, psicologo_id, fecha_hora, modalidad, estado } = req.body;
    try {
        const actualizada = await pool.query(
            `UPDATE citas
             SET paciente_id = $1, psicologo_id = $2, fecha_hora = $3,
                 modalidad = $4, estado = $5
             WHERE id = $6
             RETURNING *`,
            [paciente_id, psicologo_id, fecha_hora, modalidad, estado, id]
        );
        res.json(actualizada.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude actualizar la cita" });
    }
});

// Eliminar cita
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM citas WHERE id = $1', [id]);
        res.json({ mensaje: "Cita eliminada" });
    } catch (err) {
        res.status(500).json({ error: "No pude borrar la cita" });
    }
});

module.exports = router;