import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.js';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Configuración MercadoPago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preferenceClient = new Preference(client);

// 🛒 Rutas de productos
app.use('/api/productos', productosRoutes);

// 🧩 Ruta para crear preferencia de pago
app.post('/api/crear-preferencia', async (req, res) => {
  try {
    const { carrito } = req.body;

    const items = carrito.map(item => ({
      title: item.nombre,
      unit_price: item.precio,
      quantity: item.cantidad,
      currency_id: 'ARS',
    }));

    const preference = await preferenceClient.create({
      items,
      back_urls: {
        success: 'https://tu-sitio.vercel.app/success.html',
        failure: 'https://tu-sitio.vercel.app/failure.html',
        pending: 'https://tu-sitio.vercel.app/pending.html',
      },
      auto_return: 'approved',
    });

    res.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago.' });
  }
});

// Ruta base
app.get('/', (req, res) => {
  res.send('API de FerreOnline funcionando 🎉');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
