const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TechStore_Product';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for seeding:', MONGO_URI);

  const phoneInfoSchema = new mongoose.Schema({}, { strict: false, collection: 'PhoneInfo' });
  const PhoneInfo = mongoose.model('PhoneInfo', phoneInfoSchema);

  const sample = {
    phoneId: 1,
    id: 1,
    title: 'Sample Phone Model 1',
    image: '/img/articles/product-1.jpg',
    price: 19990000,
    oldPrice: 21990000,
    rating: 4.5,
    reviews: 42,
    description: 'Mẫu dữ liệu demo cho PhoneInfo, phoneId = 1',
    features: ['Demo feature 1', 'Demo feature 2']
  };

  // Upsert by phoneId
  const existing = await PhoneInfo.findOne({ phoneId: 1 }).lean();
  if (existing) {
    console.log('PhoneInfo with phoneId:1 already exists. Updating it.');
    await PhoneInfo.updateOne({ phoneId: 1 }, { $set: sample });
  } else {
    console.log('Inserting sample PhoneInfo with phoneId:1');
    await PhoneInfo.create(sample);
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Seed error', err);
  process.exit(1);
});
