require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TechStore_User';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGO_URI);

  const samples = [
    { name: 'Nguyen Van A', email: 'a@example.com', password: 'password123' },
    { name: 'Tran Thi B', email: 'b@example.com', password: 'password123' },
    { name: 'Le Van C', email: 'c@example.com', password: 'password123' }
  ];

  for (const s of samples) {
    const exists = await User.findOne({ email: s.email.toLowerCase().trim() });
    if (exists) {
      console.log('Skipped (exists):', s.email);
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(s.password, salt);

    const user = new User({ name: s.name, email: s.email.toLowerCase().trim(), password: hash });
    await user.save();
    console.log('Inserted:', s.email);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
