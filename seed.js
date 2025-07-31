const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const services = [
  {
    name: "Sport Spoiler Kit",
    description: "Aerodynamic spoiler for enhanced performance and style",
    price: 299.99,
    category: "spoiler"
  },
  {
    name: "Alloy Racing Wheels",
    description: "Premium 18-inch alloy wheels in various finishes",
    price: 899.99,
    category: "wheels"
  },
  {
    name: "Premium Color Wrap",
    description: "High-quality vinyl wrap in custom colors",
    price: 1499.99,
    category: "wraps"
  },
  {
    name: "Body Kit Package",
    description: "Complete body kit with front and rear bumpers",
    price: 799.99,
    category: "bodykit"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing services
    await Service.deleteMany({});
    
    // Insert new services
    await Service.insertMany(services);
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();