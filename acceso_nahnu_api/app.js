const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const swagger = require('./swagger');
const crypto = require('crypto');
const Joi = require('joi');

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

// Crear conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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
const userSchema = Joi.object({
    nombre: Joi.string().min(3).max(30).required().regex(/^[a-zA-Z\s]+$/),
    password: Joi.string().min(6).required()
});

// Función para encriptar un valor con una clave secreta
function encryptValue(value) {
    const secretKey = "78AMZ52ab78U";
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

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
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   password:
 *                     type: string
 */
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /users/{id_usuario}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 password:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
app.get('/users/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const sql = 'SELECT * FROM users WHERE id_usuario = ?';
    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
app.post('/users', async (req, res) => {
    const { nombre, password } = req.body;

    // Validar los datos de entrada
    const { error } = userSchema.validate({ nombre, password });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Cifrar la contraseña
    try {
        const hashedPassword = encryptValue(password);
        const sql = 'INSERT INTO users (nombre, password) VALUES (?, ?)';
        db.query(sql, [nombre, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const newUser = { id_usuario: result.insertId, nombre, password: hashedPassword };
            res.status(201).json(newUser);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id_usuario}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
app.put('/users/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, password } = req.body;
    
    // Validar los datos de entrada
    const { error } = userSchema.validate({ nombre, password });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Cifrar la contraseña
    try {
        const hashedPassword = encryptValue(password);
        const sql = 'UPDATE users SET nombre = ?, password = ? WHERE id_usuario = ?';
        db.query(sql, [nombre, hashedPassword, id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.json({ id_usuario, nombre, password: hashedPassword });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id_usuario}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
app.delete('/users/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const sql = 'DELETE FROM users WHERE id_usuario = ?';
    db.query(sql, [id_usuario], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(204).send();
    });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicio de sesion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio exitoso
 */
app.post('/login', async (req, res) => {
    const { nombre, password } = req.body;

    // Validar los datos de entrada
    const { error } = userSchema.validate({ nombre, password });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    // Cifrar la contraseña
    try {
        const hashedPassword = encryptValue(password);
        const sql = 'SELECT * FROM users WHERE nombre = ? AND password = ?';
        db.query(sql, [nombre, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send('Credenciales invalidas');
            }
            return res.status(200).send('Inicio exitoso');
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/docs', swagger);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
