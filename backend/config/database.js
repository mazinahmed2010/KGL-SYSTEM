const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Create indexes for better performance
    await createIndexes(conn);
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async (conn) => {
  try {
    const db = conn.connection.db;
    
    // Check if collections exist, create if not
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Create users collection with indexes
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('📑 Users collection created with indexes');
    }
    
    // Create inventory collection with indexes
    if (!collectionNames.includes('inventories')) {
      await db.createCollection('inventories');
      await db.collection('inventories').createIndex({ produceName: 1, branch: 1 }, { unique: true });
      console.log('📑 Inventory collection created with indexes');
    }
    
    // Create sales collection with indexes
    if (!collectionNames.includes('sales')) {
      await db.createCollection('sales');
      await db.collection('sales').createIndex({ date: -1 });
      await db.collection('sales').createIndex({ branch: 1 });
      console.log('📑 Sales collection created with indexes');
    }
    
    // Create procurements collection with indexes
    if (!collectionNames.includes('procurements')) {
      await db.createCollection('procurements');
      await db.collection('procurements').createIndex({ date: -1 });
      console.log('📑 Procurements collection created with indexes');
    }
    
    // Create credits collection with indexes
    if (!collectionNames.includes('credits')) {
      await db.createCollection('credits');
      await db.collection('credits').createIndex({ dueDate: 1 });
      await db.collection('credits').createIndex({ status: 1 });
      console.log('📑 Credits collection created with indexes');
    }
    
    console.log('✅ All database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

module.exports = connectDB;