const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');


const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

db.sync({ alter: true })
  .then(() => console.log('Database synchronized...'))
  .catch(err => console.log('Sync error: ' + err));


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Chase Up Inventory Management API is running');
  });
  
  // Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));