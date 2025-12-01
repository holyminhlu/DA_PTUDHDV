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
            // Prefer an existing `id` (e.g., numeric id from sample data) or `phoneId` before falling back to MongoDB _id
            id: (p.id !== undefined && p.id !== null) ? p.id : (p.phoneId !== undefined && p.phoneId !== null) ? p.phoneId : (p._id ? String(p._id) : null)
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /phones/search -> search phones by query, category, price range, etc.
app.get('/phones/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, sort = 'relevance', limit = 50 } = req.query;
        
        let query = {};
        
        // Text search on title, description, brand fields
        if (q && q.trim()) {
            const searchRegex = new RegExp(q.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { brand: searchRegex },
                { category: searchRegex }
            ];
        }
        
        // Filter by category
        if (category && category.trim()) {
            query.category = new RegExp(category.trim(), 'i');
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        // Build sort object
        let sortObj = {};
        if (sort === 'price-asc') sortObj.price = 1;
        else if (sort === 'price-desc') sortObj.price = -1;
        else if (sort === 'name') sortObj.title = 1;
        else if (sort === 'rating') sortObj.rating = -1;
        
        const phones = await Phone.find(query).sort(sortObj).limit(Number(limit)).lean();
        
        // Normalize id for frontend
        const mapped = phones.map(p => ({
            ...p,
            id: (p.id !== undefined && p.id !== null) ? p.id : (p.phoneId !== undefined && p.phoneId !== null) ? p.phoneId : (p._id ? String(p._id) : null)
        }));
        
        res.json({
            results: mapped,
            count: mapped.length,
            query: { q, category, minPrice, maxPrice, sort }
        });
    } catch (err) {
        console.error(`[${req.id}] Error searching phones:`, err.message || err);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
});

// GET /phones/by-id/:id and alias /phonesby-id/:id -> explicitly fetch by `id` field (string or numeric)
const fetchPhoneByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        // Try exact string match first
        let phone = await Phone.findOne({ id: id }).lean();

        // If not found and id looks numeric, try numeric match
        if (!phone) {
            const numeric = Number(id);
            if (!Number.isNaN(numeric)) {
                phone = await Phone.findOne({ id: numeric }).lean();
            }
        }

        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });

        // Normalize id field for frontend convenience (mirror /phones mapping)
        const mapped = {
            ...phone,
            id: (phone.id !== undefined && phone.id !== null) ? phone.id : (phone.phoneId !== undefined && phone.phoneId !== null) ? phone.phoneId : (phone._id ? String(phone._id) : null)
        };

        res.json(mapped);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phone by id ${id}:`, err.message || err);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
};

app.get('/phones/by-id/:id', fetchPhoneByIdHandler);
app.get('/phonesby-id/:id', fetchPhoneByIdHandler);

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

// GET /phoneinfo/:id -> for development/testing return the PhoneInfo document where phoneId === 1
app.get('/phoneinfo/:id', async (req, res) => {
    const { id } = req.params;
    const mongooseId = mongoose.Types.ObjectId;
    try {
        let phone = null;

        const numeric = Number(id);
        // 1. If the id looks numeric (e.g. '/product/1'), prefer matching phoneId first
        if (!Number.isNaN(numeric)) {
            phone = await PhoneInfo.findOne({ phoneId: numeric }).lean();
            if (!phone) {
                // then try id as numeric
                phone = await PhoneInfo.findOne({ id: numeric }).lean();
            }
        }

        // 2. Try matching the 'id' field as string
        if (!phone) {
            phone = await PhoneInfo.findOne({ id: id }).lean();
        }

        // 3. If still not found, try matching by ObjectId (_id)
        if (!phone && mongooseId.isValid(id)) {
            phone = await PhoneInfo.findById(id).lean();
        }

        // 4. As a last fallback, try phoneId as string
        if (!phone) {
            phone = await PhoneInfo.findOne({ phoneId: id }).lean();
        }

        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });
        res.json(phone);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phoneInfo ${id}:`, err.message || err);
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