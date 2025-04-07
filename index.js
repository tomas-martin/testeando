import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.send('API de FerreOnline funcionando 🎉');
});

console.log('URL de la base de datos:', process.env.DATABASE_URL);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
