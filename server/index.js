require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // or axios

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('GitHub Wrapped 2025 API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
