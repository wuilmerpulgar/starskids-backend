const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// READ
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pagos');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE
router.post('/', async (req, res) => {
    const { paciente_id, monto, estado_pago, fecha_pago } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO pagos (paciente_id, monto, estado_pago, fecha_pago) VALUES ($1, $2, $3, $4) RETURNING *',
            [paciente_id, monto, estado_pago, fecha_pago]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { estado_pago } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pagos SET estado_pago = $1 WHERE id = $2 RETURNING *',
            [estado_pago, id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pagos WHERE id = $1', [id]);
        res.json({ mensaje: "Pago eliminado" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;