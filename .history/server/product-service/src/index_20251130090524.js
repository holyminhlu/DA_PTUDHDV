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

// Phone model using the collection 'PhoneInfo' and flexible schema
const phoneSchema = new mongoose.Schema({}, { strict: false, collection: 'PhoneInfo' });
const Phone = mongoose.model('PhoneInfo', phoneSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('product-service: connected to MongoDB', MONGO_URI);
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
    try {
        let phone = null;

        // If the id looks like a Mongo ObjectId, try findById
        if (mongooseId.isValid(id)) {
            phone = await Phone.findById(id).lean();
        }

        // If not found and id is numeric (or stored as `id` field in sample data), try that
        if (!phone) {
            const numeric = Number(id);
            if (!Number.isNaN(numeric)) {
                phone = await Phone.findOne({ id: numeric }).lean();
            }
        }

        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });
        res.json(phone);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phone ${id}:`, err.message || err);
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