const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const prodRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MySQL database
const connectDB = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database connected...');
        
        await db.sync({ alter: true });  // Syncing models (use migrations for production)
        console.log('✅ Database synchronized...');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1); // Exit process if DB fails
    }
};
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', prodRoutes);


app.get('/', (req, res) => {
    res.send('🚀 Chase Up Inventory Management API is running');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
