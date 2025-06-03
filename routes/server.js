import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Usamos conexión local con MySQL desde db.js

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta POST para registrar cliente
app.post('/api/register', async (req, res) => {
  const { name, address, phone, email, password } = req.body;

  if (!name || !address || !phone || !email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO clien (nombre_apellido, direccion, telefono, correo, contraseña)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [name, address, phone, email, hashedPassword]);

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});
// Ruta POST para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan email o password' });
  }

  try {
    const query = 'SELECT * FROM clien WHERE correo = ?';
    const [rows] = await pool.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.contraseña);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Login exitoso
    res.json({ success: true, message: 'Login correcto', userId: user.id });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
