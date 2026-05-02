const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// READ: Ver todo
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM historial_clinico');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE: Agregar nuevo
router.post('/', async (req, res) => {
    const { paciente_id, diagnostico, observaciones, fecha_registro } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO historial_clinico (paciente_id, diagnostico, observaciones, fecha_registro) VALUES ($1, $2, $3, $4) RETURNING *',
            [paciente_id, diagnostico, observaciones, fecha_registro]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE: Editar
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { diagnostico, observaciones } = req.body;
    try {
        const result = await pool.query(
            'UPDATE historial_clinico SET diagnostico = $1, observaciones = $2 WHERE id = $3 RETURNING *',
            [diagnostico, observaciones, id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE: Borrar
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM historial_clinico WHERE id = $1', [id]);
        res.json({ mensaje: "Historial eliminado" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;