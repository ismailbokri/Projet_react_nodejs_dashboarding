const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to disable caching for static assets
app.use('/static', express.static('public', {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
}));

app.use(cors({
    origin: 'http://localhost:3000', // Replace with the origin you want to allow
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());
app.use(morgan('combined'));

// Authentication Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Other routes
const mapRoutes = require('./routes/mapRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const chartRoutes = require('./routes/chartRoutes');
const bigestRoutes = require('./routes/BigestRoutes');
const revenueRoutes = require('./routes/revenueRoutes'); // Adjust the path as needed

app.use('/api/map-data', mapRoutes);
app.use('/api/', comparisonRoutes);
app.use('/api/', chartRoutes);
app.use('/api/', revenueRoutes);
app.use('/api/', bigestRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
