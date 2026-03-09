const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/database');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    const db = mongoose.connection.db;

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('inventories').deleteMany({});
    await db.collection('sales').deleteMany({});
    await db.collection('procurements').deleteMany({});
    await db.collection('credits').deleteMany({});

    // Seed users
    const users = [
      {
        email: 'manager@kgl.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'Manager',
        branch: 'Maganjo',
        name: 'John Manager',
        createdAt: new Date()
      },
      {
        email: 'agent@kgl.com',
        password: await bcrypt.hash('agent123', 10),
        role: 'Agent',
        branch: 'Matugga',
        name: 'Jane Agent',
        createdAt: new Date()
      },
      {
        email: 'director@kgl.com',
        password: await bcrypt.hash('director123', 10),
        role: 'Director',
        branch: 'All',
        name: 'Mr. Orban',
        createdAt: new Date()
      }
    ];

    await db.collection('users').insertMany(users);
    console.log('✅ Users seeded:', users.length);

    // Seed inventory
    const inventory = [
      {
        produceName: 'BEANS001',
        produceType: 'Beans',
        availableStock: 5000,
        sellingPrice: 3000,
        branch: 'Maganjo',
        lastUpdated: new Date()
      },
      {
        produceName: 'MAIZE001',
        produceType: 'Grain Maize',
        availableStock: 8000,
        sellingPrice: 2500,
        branch: 'Maganjo',
        lastUpdated: new Date()
      },
      {
        produceName: 'COWPEAS001',
        produceType: 'Cow peas',
        availableStock: 3000,
        sellingPrice: 3500,
        branch: 'Matugga',
        lastUpdated: new Date()
      },
      {
        produceName: 'GNUTS001',
        produceType: 'G-nuts',
        availableStock: 2000,
        sellingPrice: 5000,
        branch: 'Matugga',
        lastUpdated: new Date()
      },
      {
        produceName: 'SOY001',
        produceType: 'Soybeans',
        availableStock: 4000,
        sellingPrice: 2800,
        branch: 'Maganjo',
        lastUpdated: new Date()
      }
    ];

    await db.collection('inventories').insertMany(inventory);
    console.log('✅ Inventory seeded:', inventory.length);

    // Seed sample sales
    const sales = [
      {
        produceName: 'BEANS001',
        tonnage: 500,
        amountPaid: 1500000,
        buyerName: 'John Doe',
        agentName: 'Jane Agent',
        date: new Date('2024-03-01'),
        time: '10:30',
        branch: 'Maganjo',
        paymentMethod: 'cash'
      },
      {
        produceName: 'MAIZE001',
        tonnage: 1000,
        amountPaid: 2500000,
        buyerName: 'Farmers Ltd',
        agentName: 'Bob Agent',
        date: new Date('2024-03-02'),
        time: '14:15',
        branch: 'Matugga',
        paymentMethod: 'bank transfer'
      }
    ];

    await db.collection('sales').insertMany(sales);
    console.log('✅ Sales seeded:', sales.length);

    console.log('🎉 Database seeding completed successfully!');
    
    mongoose.connection.close();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();