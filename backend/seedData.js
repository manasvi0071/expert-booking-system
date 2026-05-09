const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const expertSchema = new mongoose.Schema({
  name: String,
  category: String,
  experience: Number,
  rating: Number,
  bio: String,
  availableSlots: [{
    date: String,
    slots: [String]
  }]
});

const Expert = mongoose.model('Expert', expertSchema);

const experts = [
  {
    name: 'Dr. Aisha Sharma',
    category: 'Technology',
    experience: 8,
    rating: 4.8,
    bio: 'Full-stack developer and AI specialist with 8 years of experience.',
    availableSlots: [
      { date: '2026-05-11', slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { date: '2026-05-12', slots: ['9:00 AM', '10:00 AM', '1:00 PM'] }
    ]
  },
  {
    name: 'Dr. Rahul Mehta',
    category: 'Finance',
    experience: 12,
    rating: 4.9,
    bio: 'Financial advisor and investment strategist.',
    availableSlots: [
      { date: '2026-05-11', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
      { date: '2026-05-12', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] }
    ]
  },
  {
    name: 'Dr. Priya Nair',
    category: 'Health',
    experience: 10,
    rating: 4.7,
    bio: 'Wellness coach and nutritionist.',
    availableSlots: [
      { date: '2026-05-11', slots: ['8:00 AM', '10:00 AM', '1:00 PM'] },
      { date: '2026-05-12', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] }
    ]
  },
  {
    name: 'Mr. Vikram Singh',
    category: 'Legal',
    experience: 15,
    rating: 4.6,
    bio: 'Corporate lawyer specializing in startups.',
    availableSlots: [
      { date: '2026-05-11', slots: ['10:00 AM', '12:00 PM', '4:00 PM'] },
      { date: '2026-05-12', slots: ['9:00 AM', '1:00 PM', '3:00 PM'] }
    ]
  },
  {
    name: 'Ms. Sneha Patel',
    category: 'Technology',
    experience: 6,
    rating: 4.5,
    bio: 'UI/UX designer and product consultant.',
    availableSlots: [
      { date: '2026-05-11', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { date: '2026-05-12', slots: ['10:00 AM', '12:00 PM', '4:00 PM'] }
    ]
  },
  {
    name: 'Dr. Arjun Kapoor',
    category: 'Finance',
    experience: 9,
    rating: 4.4,
    bio: 'Tax consultant and business strategist.',
    availableSlots: [
      { date: '2026-05-11', slots: ['8:00 AM', '1:00 PM', '3:00 PM'] },
      { date: '2026-05-12', slots: ['10:00 AM', '11:00 AM', '2:00 PM'] }
    ]
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await Expert.deleteMany({});
    console.log('Old data cleared');
    await Expert.insertMany(experts);
    console.log('✅ Seed data inserted with slots!');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });