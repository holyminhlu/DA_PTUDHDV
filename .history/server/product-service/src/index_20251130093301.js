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

// Phone model using the collection 'Phone' and flexible schema
// Ensure we read from the existing 'Phone' collection in MongoDB
const phoneSchema = new mongoose.Schema({}, { strict: false, collection: 'Phone' });
const Phone = mongoose.model('Phone', phoneSchema);

// PhoneInfo model (separate collection) - used for detailed product info
const phoneInfoSchema = new mongoose.Schema({}, { strict: false, collection: 'PhoneInfo' });
const PhoneInfo = mongoose.model('PhoneInfo', phoneInfoSchema);

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
        // Normalize id for frontend convenience (prefer _id, then id, then phoneId)
        const mapped = phones.map(p => ({
            ...p,
            id: p._id ? String(p._id) : (p.id || p.phoneId || null)
        }));
        res.json(mapped);
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

        // If still not found, try matching `phoneId` (string) or string `id`
        if (!phone) {
            phone = await Phone.findOne({ phoneId: id }).lean() || await Phone.findOne({ id: id }).lean();
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

// GET /phoneinfo/:id -> for development/testing return the PhoneInfo document where phoneId === 1
app.get('/phoneinfo/:id', async (req, res) => {
    try {
        // For the current request, return the product whose phoneId equals 1
        const phone = await PhoneInfo.findOne({ phoneId: 1 }).lean();
        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });
        res.json(phone);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phoneInfo (phoneId=1):`, err.message || err);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
});