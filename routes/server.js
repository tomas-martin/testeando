import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },
});

// Ruta POST para insertar cliente en tabla "clien"
app.post('/api/clientes', async (req, res) => {
  const { nombre_apellido, direccion, telefono, correo, contraseña } = req.body;

  // Validación básica
  if (!nombre_apellido || !direccion || !telefono || !correo || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const query = `
      INSERT INTO clien (nombre_apellido, direccion, telefono, correo, contraseña)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const values = [nombre_apellido, direccion, telefono, correo, contraseña];

    const result = await pool.query(query, values);

    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
