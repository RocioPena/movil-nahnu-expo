const express = require('express');
const swagger = require('./swagger');
const fs = require('fs');
const app = express();
const mysql = require('mysql');
const port = 3003;
const Joi = require('joi');

// Configurar middleware para parsear JSON
app.use(express.json());

// Crear conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Andy_0321",
    database: "diccionario"
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Esquema de validación con Joi
const palabraSchema = Joi.object({
    palabra: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/),
    audio_esp_limpio: Joi.string().required().pattern(/\.mp3$/)
});
const regionSchema = Joi.object({
    region: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/)
});
const pronunciacionSchema = Joi.object({
    pronunciacion: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/),
    audio_otomi_limpio: Joi.string().required().pattern(/\.mp3$/),
    lengua_madre: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/),
    dialecto: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/)
});

// Leer datos del archivo JSON y convertirlos en un objeto diccionario
let dictionary = require('./data.json');

// Anotación JSDoc para documentar la ruta '/'
/**
 * @swagger
 * /:
 *   get:
 *     summary: Saludo principal
 *     description: Devuelve un saludo básico
 */
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

/**
 * @swagger
 * /palabras:
 *   get:
 *     summary: Obtener todos las palabras
 *     responses:
 *       200:
 *         description: Lista de palabras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_palabra:
 *                     type: integer
 *                   palabra:
 *                     type: string
 *                   audio_esp_limpio:
 *                     type: string
 */
app.get('/palabras', (req, res) => {
    const sql = 'SELECT * FROM palabras';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /palabras:
 *   get:
 *     summary: Obtener todas las palabras
 *     responses:
 *       200:
 *         description: Lista de palabras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_palabras:
 *                     type: integer
 *                   palabra:
 *                     type: string
 *                   audio_esp_limpio:
 *                     type: string
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 */
app.get('/palabras', (req, res) => {
    const sql = 'SELECT * FROM palabras';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /palabras/{id_palabras}:
 *   get:
 *     summary: Obtener una palabra por ID
 *     parameters:
 *       - in: path
 *         name: id_palabras
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la palabra
 *     responses:
 *       200:
 *         description: Datos de la palabra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_palabras:
 *                   type: integer
 *                 palabra:
 *                   type: string
 *                 audio_esp_limpio:
 *                   type: string
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Palabra no encontrada
 */
app.get('/palabras/:id_palabras', (req, res) => {
    const { id_palabras } = req.params;
    const sql = 'SELECT * FROM palabras WHERE id_palabras = ?';
    db.query(sql, [id_palabras], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Palabra no encontrada');
        }
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /palabras:
 *   post:
 *     summary: Crear una nueva palabra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               palabra:
 *                 type: string
 *               audio_esp_limpio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Palabra creada
 */
app.post('/palabras', (req, res) => {
    const { palabra, audio_esp_limpio } = req.body;

    // Validar los datos de entrada
    const { error } = palabraSchema.validate({ palabra, audio_esp_limpio });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'INSERT INTO palabras (palabra, audio_esp_limpio) VALUES (?, ?)';
    db.query(sql, [palabra, audio_esp_limpio], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newPalabra = { id_palabras: result.insertId, palabra, audio_esp_limpio };
        res.status(201).json(newPalabra);
    });
});

/**
 * @swagger
 * /palabras/{id_palabras}:
 *   put:
 *     summary: Actualizar una palabra por ID
 *     parameters:
 *       - in: path
 *         name: id_palabras
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la palabra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               palabra:
 *                 type: string
 *               audio_esp_limpio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Palabra actualizada
 *       404:
 *         description: Palabra no encontrada
 */
app.put('/palabras/:id_palabras', (req, res) => {
    const { id_palabras } = req.params;
    const { palabra, audio_esp_limpio } = req.body;
    // Validar los datos de entrada
    const { error } = palabraSchema.validate({ palabra, audio_esp_limpio });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const sql = 'UPDATE palabras SET palabra = ?, audio_esp_limpio = ? WHERE id_palabras = ?';
    db.query(sql, [palabra, audio_esp_limpio, id_palabras], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Palabra no encontrada');
        }
        res.json({ id_palabras, palabra, audio_esp_limpio });
    });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Saludo principal
 *     description: Devuelve un saludo básico
 */
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

/**
 * @swagger
 * /regiones:
 *   get:
 *     summary: Obtener todas las regiones
 *     responses:
 *       200:
 *         description: Lista de regiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_region:
 *                     type: integer
 *                   region:
 *                     type: string
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 */
app.get('/regiones', (req, res) => {
    const sql = 'SELECT * FROM regiones';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /regiones/{id_region}:
 *   get:
 *     summary: Obtener una región por ID
 *     parameters:
 *       - in: path
 *         name: id_region
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la región
 *     responses:
 *       200:
 *         description: Datos de la región
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_region:
 *                   type: integer
 *                 region:
 *                   type: string
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Región no encontrada
 */
app.get('/regiones/:id_region', (req, res) => {
    const { id_region } = req.params;
    const sql = 'SELECT * FROM regiones WHERE id_region = ?';
    db.query(sql, [id_region], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Región no encontrada');
        }
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /regiones:
 *   post:
 *     summary: Crear una nueva región
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *     responses:
 *       201:
 *         description: Región creada
 */
app.post('/regiones', (req, res) => {
    const { region } = req.body;

    // Validar los datos de entrada
    const { error } = regionSchema.validate({ region });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'INSERT INTO regiones (region) VALUES (?)';
    db.query(sql, [region], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newRegion = { id_region: result.insertId, region, fecha_creacion: new Date() };
        res.status(201).json(newRegion);
    });
});

/**
 * @swagger
 * /regiones/{id_region}:
 *   put:
 *     summary: Actualizar una región por ID
 *     parameters:
 *       - in: path
 *         name: id_region
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la región
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Región actualizada
 *       404:
 *         description: Región no encontrada
 */
app.put('/regiones/:id_region', (req, res) => {
    const { id_region } = req.params;
    const { region } = req.body;

    // Validar los datos de entrada
    const { error } = regionSchema.validate({ region });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'UPDATE regiones SET region = ? WHERE id_region = ?';
    db.query(sql, [region, id_region], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Región no encontrada');
        }
        res.json({ id_region, region });
    });
});
/**
 * @swagger
 * /pronunciaciones:
 *   get:
 *     summary: Obtener todos las pronunciaciones
 *     responses:
 *       200:
 *         description: Lista de pronunciaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pronunciacion:
 *                     type: integer
 *                   pronunciacion:
 *                     type: string
 *                   audio_otomi:
 *                     type: string
 */
app.get('/pronunciaciones', (req, res) => {
    const sql = 'SELECT * FROM pronunciaciones';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /pronunciaciones/{id_pronunciacion}:
 *   get:
 *     summary: Obtener una pronunciación por ID
 *     parameters:
 *       - in: path
 *         name: id_pronunciacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pronunciación
 *     responses:
 *       200:
 *         description: Datos de la pronunciación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pronunciacion:
 *                   type: integer
 *                 pronunciacion:
 *                   type: string
 *                 audio_otomi_limpio:
 *                   type: string
 *                 lengua_madre:
 *                   type: string
 *                 dialecto:
 *                   type: string
 *                 id_palabra_fk:
 *                   type: integer
 *                 id_region_fk:
 *                   type: integer
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Pronunciación no encontrada
 */
app.get('/pronunciaciones/:id_pronunciacion', (req, res) => {
    const { id_pronunciacion } = req.params;
    const sql = 'SELECT * FROM pronunciaciones WHERE id_pronunciacion = ?';
    db.query(sql, [id_pronunciacion], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Pronunciación no encontrada');
        }
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /pronunciaciones:
 *   post:
 *     summary: Crear una nueva pronunciación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pronunciacion:
 *                 type: string
 *               audio_otomi_limpio:
 *                 type: string
 *               lengua_madre:
 *                 type: string
 *               dialecto:
 *                 type: string
 *               id_palabra_fk:
 *                 type: integer
 *               id_region_fk:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pronunciación creada
 */
app.post('/pronunciaciones', (req, res) => {
    const { pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk } = req.body;

    // Validar los datos de entrada
    const { error } = pronunciacionSchema.validate({ pronunciacion, audio_otomi_limpio, lengua_madre, dialecto });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'INSERT INTO pronunciaciones (pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newPronunciacion = { id_pronunciacion: result.insertId, pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk };
        res.status(201).json(newPronunciacion);
    });
});

/**
 * @swagger
 * /pronunciaciones/{id_pronunciacion}:
 *   put:
 *     summary: Actualizar una pronunciación por ID
 *     parameters:
 *       - in: path
 *         name: id_pronunciacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pronunciación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pronunciacion:
 *                 type: string
 *               audio_otomi_limpio:
 *                 type: string
 *               lengua_madre:
 *                 type: string
 *               dialecto:
 *                 type: string
 *               id_palabra_fk:
 *                 type: integer
 *               id_region_fk:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pronunciación actualizada
 *       404:
 *         description: Pronunciación no encontrada
 */
app.put('/pronunciaciones/:id_pronunciacion', (req, res) => {
    const { id_pronunciacion } = req.params;
    const { pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk } = req.body;
    
    // Validar los datos de entrada
    const { error } = pronunciacionSchema.validate({ pronunciacion, audio_otomi_limpio, lengua_madre, dialecto });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'UPDATE pronunciaciones SET pronunciacion = ?, audio_otomi_limpio = ?, lengua_madre = ?, dialecto = ?, id_palabra_fk = ?, id_region_fk = ? WHERE id_pronunciacion = ?';
    db.query(sql, [pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk, id_pronunciacion], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Pronunciación no encontrada');
        }
        res.json({ id_pronunciacion, pronunciacion, audio_otomi_limpio, lengua_madre, dialecto, id_palabra_fk, id_region_fk });
    });
});

/**
 * @swagger
 * /pronunciaciones/{id_pronunciacion}:
 *   delete:
 *     summary: Eliminar una pronunciación por ID
 *     parameters:
 *       - in: path
 *         name: id_pronunciacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pronunciación
 *     responses:
 *       204:
 *         description: Pronunciación eliminada
 *       404:
 *         description: Pronunciación no encontrada
 */
app.delete('/pronunciaciones/:id_pronunciacion', (req, res) => {
    const { id_pronunciacion } = req.params;
    
    // Primero, obtenemos los IDs de las tablas relacionadas
    const getRelatedIdsSql = 'SELECT id_palabra_fk, id_region_fk FROM pronunciaciones WHERE id_pronunciacion = ?';
    db.query(getRelatedIdsSql, [id_pronunciacion], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Pronunciación no encontrada');
        }

        const { id_palabra_fk, id_region_fk } = results[0];

        // Luego, eliminamos la pronunciación
        const deletePronunciacionSql = 'DELETE FROM pronunciaciones WHERE id_pronunciacion = ?';
        db.query(deletePronunciacionSql, [id_pronunciacion], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Pronunciación no encontrada');
            }

            // Finalmente, eliminamos las entradas en las tablas relacionadas
            const deletePalabraSql = 'DELETE FROM palabras WHERE id_palabras = ?';
            const deleteRegionSql = 'DELETE FROM regiones WHERE id_region = ?';

            db.query(deletePalabraSql, [id_palabra_fk], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                db.query(deleteRegionSql, [id_region_fk], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.status(204).send();
                });
            });
        });
    });
});

app.get('/palabra_region', (req, res) => {
    const sql = 'SELECT p.palabra, r.region FROM pronunciaciones pr JOIN palabras p ON pr.id_palabra_fk = p.id_palabras JOIN regiones r ON pr.id_region_fk = r.id_region WHERE pr.id_pronunciacion = 1';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.use('/docs', swagger);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

//Borrar pronunciaciones y asi borrara palabras y regiones