const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// READ
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fichas_seguimiento');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE
router.post('/', async (req, res) => {
    const { paciente_id, psicologo_id, detalle_sesion, fecha } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO fichas_seguimiento (paciente_id, psicologo_id, detalle_sesion, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
            [paciente_id, psicologo_id, detalle_sesion, fecha]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { detalle_sesion } = req.body;
    try {
        const result = await pool.query(
            'UPDATE fichas_seguimiento SET detalle_sesion = $1 WHERE id = $2 RETURNING *',
            [detalle_sesion, id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM fichas_seguimiento WHERE id = $1', [id]);
        res.json({ mensaje: "Ficha eliminada" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;