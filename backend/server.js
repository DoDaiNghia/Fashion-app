
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Routes & Middleware của bạn
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const addressRoutes = require('./src/routes/addressRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

// ====== Kiểm tra biến môi trường ======
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'Myapp-2025';

// Debug ngắn (có thể tắt sau khi OK)
console.log('ENV file exists:', fs.existsSync(path.join(__dirname, '.env')));
console.log('MONGODB_URI =', MONGODB_URI);
console.log('DB_NAME =', DB_NAME);

if (!MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI. Hãy tạo backend/.env và điền MONGODB_URI.');
    process.exit(1);
}

// ====== Kết nối MongoDB ======
mongoose
    .connect(MONGODB_URI, { dbName: DB_NAME })
    .then(() => console.log('✅ MongoDB connected. DB:', mongoose.connection.name))
    .catch((err) => {
        console.error('Mongo connect error:', err.message);
        process.exit(1);
    });

// ====== Khởi tạo app ======
const app = express();

// Security & Rate Limit
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Test endpoints
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) =>
    res.status(200).json({ status: 'OK', message: 'Server đang chạy' })
);


// Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} đã bị chiếm. Hãy đổi PORT trong .env hoặc tắt tiến trình đang dùng cổng này.`);
    } else {
        console.error('❌ Server listen error:', err);
    }
});
