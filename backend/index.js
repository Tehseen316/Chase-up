const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');


const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Sync database models
db.sync({ alter: true })
  .then(() => console.log('Database synchronized...'))
  .catch(err => console.log('Sync error: ' + err));

  
// Root route
app.get('/', (req, res) => {
    res.send('Chase Up Inventory Management API is running');
  });
  
  // Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));