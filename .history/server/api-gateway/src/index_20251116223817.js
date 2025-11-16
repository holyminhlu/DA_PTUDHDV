const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'gateway ok' }));

// Forward GET /api/products -> product-service /phones
app.get('/api/products', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phones`, { params: req.query, timeout: 5000 });
        res.json(resp.data);
    } catch (err) {
        console.error('gateway error /api/products', err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway' });
    }
});

// Forward GET /api/products/:id -> product-service /phones/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        const resp = await axios.get(`${PRODUCT_SERVICE_URL}/phones/${req.params.id}`, { timeout: 5000 });
        res.json(resp.data);
    } catch (err) {
        console.error('gateway error /api/products/:id', err.message || err);
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'Bad gateway' });
    }
});

app.listen(PORT, () => {
    console.log(`api-gateway listening on port ${PORT}, product-service -> ${PRODUCT_SERVICE_URL}`);
});

// Forward auth register/login to auth-service
app.post('/api/auth/register', async (req, res) => {
    try {
        const resp = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, req.body, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/auth/register', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const resp = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, req.body, { timeout: 5000 });
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error('gateway error /api/auth/login', err.message || err);
        const status = err.response?.status || 502;
        return res.status(status).json(err.response?.data || { error: 'Bad gateway' });
    }
});