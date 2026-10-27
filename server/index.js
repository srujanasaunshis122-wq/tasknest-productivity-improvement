const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const scoreRoutes = require('./routes/score');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/score', scoreRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'TaskNest API is running' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
