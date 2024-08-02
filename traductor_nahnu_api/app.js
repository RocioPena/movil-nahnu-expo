const express = require('express');
const bodyParser = require('body-parser');
const swagger = require('./swagger');
const fs = require('fs');
const app = express();
const mysql = require('mysql');
const port = 3000;
const Joi = require('joi');

// Configurar middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.json());

// Crear conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Andy_0321",
  database: "traductor"
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
const contenido_espSchema = Joi.object({
    transcripcion_esp: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/),
    audio_esp: Joi.string().required().pattern(/\.mp3$/)
});
const contenido_nahuatlSchema = Joi.object({
    transcripcion_nahuatl: Joi.string().min(3).max(100).required().regex(/^[a-zA-Z\s]+$/),
    audio_nahuatl: Joi.string().required().pattern(/\.mp3$/)
});
const traductorSchema = Joi.object({
    id_contenido_nahuatl: Joi.number().integer().required(),
    id_contenido_esp: Joi.number().integer().required()
});

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

// Contenido_esp

/**
 * @swagger
 * /contenido_esp:
 *   get:
 *     summary: Obtener todos los contenidos en español
 *     responses:
 *       200:
 *         description: Lista de contenidos en español
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_contenido_esp:
 *                     type: integer
 *                   audio_esp:
 *                     type: string
 *                   transcripcion_esp:
 *                     type: string
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 */
app.get('/contenido_esp', (req, res) => {
  const sql = 'SELECT * FROM contenido_esp';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

// Obtener una entrada de contenido_esp por ID
/**
* @swagger
* /contenido_esp/{id_contenido_esp}:
*   get:
*     summary: Obtener un contenido en español por ID
*     parameters:
*       - in: path
*         name: id_contenido_esp
*         required: true
*         schema:
*           type: integer
*         description: ID del contenido en español
*     responses:
*       200:
*         description: Datos del contenido en español
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id_contenido_esp:
*                   type: integer
*                 audio_esp:
*                   type: string
*                 transcripcion_esp:
*                   type: string
*                 fecha_creacion:
*                   type: string
*                   format: date-time
*       404:
*         description: Contenido en español no encontrado
*/
app.get('/contenido_esp/:id_contenido_esp', (req, res) => {
  const { id_contenido_esp } = req.params;
  const sql = 'SELECT * FROM contenido_esp WHERE id_contenido_esp = ?';
  db.query(sql, [id_contenido_esp], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).send('Contenido en español no encontrado');
      }
      res.json(results[0]);
  });
});

// Crear una nueva entrada de contenido_esp
/**
* @swagger
* /contenido_esp:
*   post:
*     summary: Crear un nuevo contenido en español
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               audio_esp:
*                 type: string
*               transcripcion_esp:
*                 type: string
*     responses:
*       201:
*         description: Contenido en español creado
*/
app.post('/contenido_esp', (req, res) => {
  const { audio_esp, transcripcion_esp } = req.body;

    // Validar los datos de entrada
    const { error } = contenido_espSchema.validate({ audio_esp, transcripcion_esp });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

  const sql = 'INSERT INTO contenido_esp (audio_esp, transcripcion_esp) VALUES (?, ?)';
  db.query(sql, [audio_esp, transcripcion_esp], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      const newContenidoEsp = { id_contenido_esp: result.insertId, audio_esp, transcripcion_esp, fecha_creacion: new Date() };
      res.status(201).json(newContenidoEsp);
  });
});

// Actualizar una entrada de contenido_esp por ID
/**
* @swagger
* /contenido_esp/{id_contenido_esp}:
*   put:
*     summary: Actualizar un contenido en español por ID
*     parameters:
*       - in: path
*         name: id_contenido_esp
*         required: true
*         schema:
*           type: integer
*         description: ID del contenido en español
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               audio_esp:
*                 type: string
*               transcripcion_esp:
*                 type: string
*     responses:
*       200:
*         description: Contenido en español actualizado
*       404:
*         description: Contenido en español no encontrado
*/
app.put('/contenido_esp/:id_contenido_esp', (req, res) => {
  const { id_contenido_esp } = req.params;
  const { audio_esp, transcripcion_esp } = req.body;

    // Validar los datos de entrada
    const { error } = contenido_espSchema.validate({ audio_esp, transcripcion_esp });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
  const sql = 'UPDATE contenido_esp SET audio_esp = ?, transcripcion_esp = ? WHERE id_contenido_esp = ?';
  db.query(sql, [audio_esp, transcripcion_esp, id_contenido_esp], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Contenido en español no encontrado');
      }
      res.json({ id_contenido_esp, audio_esp, transcripcion_esp });
  });
});

// Contenido_nahuatl

/**
 * @swagger
 * /contenido_nahuatl:
 *   get:
 *     summary: Obtener todos los contenidos en náhuatl
 *     responses:
 *       200:
 *         description: Lista de contenidos en náhuatl
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_contenido_nahuatl:
 *                     type: integer
 *                   audio_nahuatl:
 *                     type: string
 *                   transcripcion_nahuatl:
 *                     type: string
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 */
app.get('/contenido_nahuatl', (req, res) => {
  const sql = 'SELECT * FROM contenido_nahuatl';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

// Obtener una entrada de contenido_nahuatl por ID
/**
* @swagger
* /contenido_nahuatl/{id_contenido_nahuatl}:
*   get:
*     summary: Obtener un contenido en náhuatl por ID
*     parameters:
*       - in: path
*         name: id_contenido_nahuatl
*         required: true
*         schema:
*           type: integer
*         description: ID del contenido en náhuatl
*     responses:
*       200:
*         description: Datos del contenido en náhuatl
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id_contenido_nahuatl:
*                   type: integer
*                 audio_nahuatl:
*                   type: string
*                 transcripcion_nahuatl:
*                   type: string
*                 fecha_creacion:
*                   type: string
*                   format: date-time
*       404:
*         description: Contenido en náhuatl no encontrado
*/
app.get('/contenido_nahuatl/:id_contenido_nahuatl', (req, res) => {
  const { id_contenido_nahuatl } = req.params;
  const sql = 'SELECT * FROM contenido_nahuatl WHERE id_contenido_nahuatl = ?';
  db.query(sql, [id_contenido_nahuatl], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).send('Contenido en náhuatl no encontrado');
      }
      res.json(results[0]);
  });
});

// Crear una nueva entrada de contenido_nahuatl
/**
* @swagger
* /contenido_nahuatl:
*   post:
*     summary: Crear un nuevo contenido en náhuatl
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               audio_nahuatl:
*                 type: string
*               transcripcion_nahuatl:
*                 type: string
*     responses:
*       201:
*         description: Contenido en náhuatl creado
*/
app.post('/contenido_nahuatl', (req, res) => {
  const { audio_nahuatl, transcripcion_nahuatl } = req.body;

    // Validar los datos de entrada
    const { error } = contenido_nahuatlSchema.validate({ audio_nahuatl, transcripcion_nahuatl });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

  const sql = 'INSERT INTO contenido_nahuatl (audio_nahuatl, transcripcion_nahuatl) VALUES (?, ?)';
  db.query(sql, [audio_nahuatl, transcripcion_nahuatl], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      const newContenidoNahuatl = { id_contenido_nahuatl: result.insertId, audio_nahuatl, transcripcion_nahuatl, fecha_creacion: new Date() };
      res.status(201).json(newContenidoNahuatl);
  });
});

// Actualizar una entrada de contenido_nahuatl por ID
/**
* @swagger
* /contenido_nahuatl/{id_contenido_nahuatl}:
*   put:
*     summary: Actualizar un contenido en náhuatl por ID
*     parameters:
*       - in: path
*         name: id_contenido_nahuatl
*         required: true
*         schema:
*           type: integer
*         description: ID del contenido en náhuatl
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               audio_nahuatl:
*                 type: string
*               transcripcion_nahuatl:
*                 type: string
*     responses:
*       200:
*         description: Contenido en náhuatl actualizado
*       404:
*         description: Contenido en náhuatl no encontrado
*/
app.put('/contenido_nahuatl/:id_contenido_nahuatl', (req, res) => {
  const { id_contenido_nahuatl } = req.params;
  const { audio_nahuatl, transcripcion_nahuatl } = req.body;

    // Validar los datos de entrada
    const { error } = contenido_nahuatlSchema.validate({ audio_nahuatl, transcripcion_nahuatl });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

  const sql = 'UPDATE contenido_nahuatl SET audio_nahuatl = ?, transcripcion_nahuatl = ? WHERE id_contenido_nahuatl = ?';
  db.query(sql, [audio_nahuatl, transcripcion_nahuatl, id_contenido_nahuatl], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Contenido en náhuatl no encontrado');
      }
      res.json({ id_contenido_nahuatl, audio_nahuatl, transcripcion_nahuatl });
  });
});

// traductor

/**
 * @swagger
 * /traductores:
 *   get:
 *     summary: Obtener todos los traductores
 *     responses:
 *       200:
 *         description: Lista de traductores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_traductor:
 *                     type: integer
 *                   id_contenido_nahuatl:
 *                     type: integer
 *                   id_contenido_esp:
 *                     type: integer
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 */
app.get('/traductores', (req, res) => {
  const sql = 'SELECT * FROM traductor';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

/**
* @swagger
* /traductores/{id_traductor}:
*   get:
*     summary: Obtener un traductor por ID
*     parameters:
*       - in: path
*         name: id_traductor
*         required: true
*         schema:
*           type: integer
*         description: ID del traductor
*     responses:
*       200:
*         description: Datos del traductor
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id_traductor:
*                   type: integer
*                 id_contenido_nahuatl:
*                   type: integer
*                 id_contenido_esp:
*                   type: integer
*                 fecha_creacion:
*                   type: string
*                   format: date-time
*       404:
*         description: Traductor no encontrado
*/
app.get('/traductores/:id_traductor', (req, res) => {
  const { id_traductor } = req.params;
  const sql = 'SELECT * FROM traductor WHERE id_traductor = ?';
  db.query(sql, [id_traductor], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).send('Traductor no encontrado');
      }
      res.json(results[0]);
  });
});

/**
* @swagger
* /traductores:
*   post:
*     summary: Crear un nuevo traductor
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id_contenido_nahuatl:
*                 type: integer
*               id_contenido_esp:
*                 type: integer
*     responses:
*       201:
*         description: Traductor creado
*/
app.post('/traductores', (req, res) => {
    const { id_contenido_nahuatl, id_contenido_esp } = req.body;

    // Validar los datos de entrada
    const { error } = traductorSchema.validate({ id_contenido_nahuatl, id_contenido_esp });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const sql = 'INSERT INTO traductor (id_contenido_nahuatl, id_contenido_esp) VALUES (?, ?)';
    db.query(sql, [id_contenido_nahuatl, id_contenido_esp], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newTraductor = { id_traductor: result.insertId, id_contenido_nahuatl, id_contenido_esp, fecha_creacion: new Date() };
        res.status(201).json(newTraductor);
    });
});

/**
* @swagger
* /traductores/{id_traductor}:
*   put:
*     summary: Actualizar un traductor por ID
*     parameters:
*       - in: path
*         name: id_traductor
*         required: true
*         schema:
*           type: integer
*         description: ID del traductor
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id_contenido_nahuatl:
*                 type: integer
*               id_contenido_esp:
*                 type: integer
*     responses:
*       200:
*         description: Traductor actualizado
*       404:
*         description: Traductor no encontrado
*/
app.put('/traductores/:id_traductor', (req, res) => {
  const { id_traductor } = req.params;
  const { id_contenido_nahuatl, id_contenido_esp } = req.body;

    // Validar los datos de entrada
    const { error } = traductorSchema.validate({ id_contenido_nahuatl, id_contenido_esp });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

  const sql = 'UPDATE traductor SET id_contenido_nahuatl = ?, id_contenido_esp = ? WHERE id_traductor = ?';
  db.query(sql, [id_contenido_nahuatl, id_contenido_esp, id_traductor], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Traductor no encontrado');
      }
      res.json({ id_traductor, id_contenido_nahuatl, id_contenido_esp });
  });
});

/**
 * @swagger
 * /traductor/{id_traductor}:
 *   delete:
 *     summary: Eliminar un traductor por ID
 *     parameters:
 *       - in: path
 *         name: id_traductor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del traductor
 *     responses:
 *       204:
 *         description: Traductor eliminado
 *       404:
 *         description: Traductor no encontrado
 */
app.delete('/traductor/:id_traductor', (req, res) => {
  const { id_traductor } = req.params;

  // Primero, obtenemos los IDs de las tablas relacionadas
  const getRelatedIdsSql = 'SELECT id_contenido_nahuatl, id_contenido_esp FROM traductor WHERE id_traductor = ?';
  db.query(getRelatedIdsSql, [id_traductor], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).send('Traductor no encontrado');
      }

      const { id_contenido_nahuatl, id_contenido_esp } = results[0];

      // Luego, eliminamos el traductor
      const deleteTraductorSql = 'DELETE FROM traductor WHERE id_traductor = ?';
      db.query(deleteTraductorSql, [id_traductor], (err, result) => {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          if (result.affectedRows === 0) {
              return res.status(404).send('Traductor no encontrado');
          }

          // Finalmente, eliminamos las entradas en las tablas relacionadas
          const deleteContenidoNahuatlSql = 'DELETE FROM contenido_nahuatl WHERE id_contenido_nahuatl = ?';
          const deleteContenidoEspSql = 'DELETE FROM contenido_esp WHERE id_contenido_esp = ?';

          db.query(deleteContenidoNahuatlSql, [id_contenido_nahuatl], (err) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }

              db.query(deleteContenidoEspSql, [id_contenido_esp], (err) => {
                  if (err) {
                      return res.status(500).json({ error: err.message });
                  }

                  res.status(204).send();
              });
          });
      });
  });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Formato invalido' });
    }
    next();
});

app.use('/docs', swagger);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});