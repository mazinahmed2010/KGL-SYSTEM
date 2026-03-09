const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas connection...');
  console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // List databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('📊 Available databases:', dbs.databases.map(db => db.name));
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));

    // Insert test document
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful'
    });
    console.log('✅ Test document inserted');

    // Read test document
    const testDoc = await testCollection.findOne({ test: true });
    console.log('📄 Test document:', testDoc);

    // Clean up
    await testCollection.deleteMany({ test: true });
    console.log('🧹 Test document cleaned up');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB Atlas');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
};

testConnection();