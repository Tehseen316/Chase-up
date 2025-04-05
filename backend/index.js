const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const prodRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const saleRoute = require('./routes/saleRoutes');

// Import the Sale model
const Sale = require('./models/Sale');
const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Connect to MySQL database
const connectDB = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database connected...');
        
        // Sync the database (Sale model is now registered)
        await db.sync({ alter: true });
        console.log('✅ Database synchronized...');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
};
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', prodRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoute);
app.get('/', (req, res) => {
    res.send('🚀 Chase Up Inventory Management API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Unexpected server error',
        error: err.message
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));