import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.js';
import mercadopago from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN, // lo vamos a cargar en Railway como variable
});

// Rutas
app.use('/api/productos', productosRoutes);

// 🧩 Nueva ruta para Mercado Pago
app.post('/api/crear-preferencia', async (req, res) => {
  try {
    const { carrito } = req.body;

    const items = carrito.map(item => ({
      title: item.nombre,
      unit_price: item.precio,
      quantity: item.cantidad,
      currency_id: 'ARS',
    }));

    const preference = await mercadopago.preferences.create({
      items,
      back_urls: {
        success: 'https://tu-sitio.vercel.app/success.html',
        failure: 'https://tu-sitio.vercel.app/failure.html',
        pending: 'https://tu-sitio.vercel.app/pending.html',
      },
      auto_return: 'approved',
    });

    res.json({ init_point: preference.body.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago.' });
  }
});

app.get('/', (req, res) => {
  res.send('API de FerreOnline funcionando 🎉');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
