const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { randomUUID } = require('crypto');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TechStore_Product';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Middleware: request logging with request ID
app.use((req, res, next) => {
  req.id = randomUUID().slice(0, 8);
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.id}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Phone model using the existing collection 'Phone' and flexible schema
const phoneSchema = new mongoose.Schema({}, { strict: false, collection: 'Phone' });
const Phone = mongoose.model('Phone', phoneSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('product-service: connected to MongoDB');
}).catch(err => {
    console.error('product-service: MongoDB connection error', err);
    process.exit(1);
});

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));

// GET /phones -> list all phones (paginate if needed)
app.get('/phones', async (req, res) => {
    try {
        const phones = await Phone.find().limit(100).lean();
        res.json(phones);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /phones/:id
app.get('/phones/:id', async (req, res) => {
    const { id } = req.params;
    const mongooseId = mongoose.Types.ObjectId;
    if (!mongooseId.isValid(id)) return res.status(400).json({ error: 'Invalid id', requestId: req.id });
    try {
        const phone = await Phone.findById(id).lean();
        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });
        res.json(phone);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phone ${id}:`, err.message);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.listen(PORT, () => {
    console.log(`product-service listening on port ${PORT}`);
});