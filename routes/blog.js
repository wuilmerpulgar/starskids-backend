const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Importa la conexión centralizada a la base de datos

// --- OPERACIONES DEL BLOG (CRUD) ---

// 1. OBTENER TODOS LOS ARTÍCULOS
// Justificación Tesis: Implementación de lectura de recursos para la vista pública.
router.get('/', async (req, res) => {
    try {
        // Ordenamos por fecha de creación descendente para mostrar lo más reciente primero
        const resultado = await pool.query('SELECT * FROM articulos_blog ORDER BY fecha_creacion DESC');
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener las entradas del blog" });
    }
});

// 2. OBTENER UN ARTÍCULO ESPECÍFICO POR ID
// Justificación Tesis: Recuperación de un recurso individual para la vista detallada (Lectura completa).
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM articulos_blog WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error al buscar el artículo" });
    }
});

// 3. PUBLICAR UN NUEVO ARTÍCULO (Operación para el Admin)
// Justificación Tesis: Persistencia de datos mediante el método HTTP POST.
router.post('/', async (req, res) => {
    const { titulo, resumen, contenido, categoria, imagen_url, es_destacado } = req.body;
    try {
        const nuevo = await pool.query(
            `INSERT INTO articulos_blog (titulo, resumen, contenido, categoria, imagen_url, es_destacado) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [titulo, resumen, contenido, categoria, imagen_url, es_destacado || false]
        );
        res.json(nuevo.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "No pude guardar el artículo" });
    }
});

// 4. EDITAR UN ARTÍCULO EXISTENTE
// Justificación Tesis: Actualización de recursos para el mantenimiento de la información clínica.
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, resumen, contenido, categoria, imagen_url, es_destacado } = req.body;
    try {
        const actualizado = await pool.query(
            `UPDATE articulos_blog 
             SET titulo = $1, resumen = $2, contenido = $3, categoria = $4, imagen_url = $5, es_destacado = $6 
             WHERE id = $7 RETURNING *`,
            [titulo, resumen, contenido, categoria, imagen_url, es_destacado, id]
        );
        res.json(actualizado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar el artículo" });
    }
});

// 5. ELIMINAR UN ARTÍCULO
// Justificación Tesis: Gestión del ciclo de vida del contenido mediante el método DELETE.
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM articulos_blog WHERE id = $1', [id]);
        res.json({ mensaje: "Artículo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar el artículo" });
    }
});

module.exports = router;