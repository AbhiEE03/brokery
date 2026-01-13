// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection class
class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate_db';

    // MongoDB connection options
    const options = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };

    mongoose.connect(mongoURI, options)
      .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🎯 Host: ${mongoose.connection.host}`);
        console.log(`🔗 Port: ${mongoose.connection.port}`);
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('🔄 Attempting to reconnect in 5 seconds...');
        setTimeout(() => this._connect(), 5000);
      });

    // MongoDB connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from DB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 Mongoose connection closed through app termination');
      process.exit(0);
    });
  }

  // Get connection status
  getStatus() {
    return {
      connected: mongoose.connection.readyState === 1,
      state: this.getStateString(mongoose.connection.readyState),
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      models: Object.keys(mongoose.connection.models)
    };
  }

  // Convert readyState to string
  getStateString(state) {
    switch (state) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }

  // Close database connection
  async close() {
    try {
      await mongoose.connection.close();
      console.log('🔒 Database connection closed');
      return true;
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      return false;
    }
  }

  // Drop database (for testing/development)
  async dropDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot drop database in production!');
    }

    try {
      await mongoose.connection.db.dropDatabase();
      console.log('🗑️ Database dropped successfully');
      return true;
    } catch (error) {
      console.error('❌ Error dropping database:', error);
      return false;
    }
  }

  // Clear all collections (for testing)
  async clearAllCollections() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clear collections in production!');
    }

    const collections = mongoose.connection.collections;
    const results = {};

    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
        results[key] = 'cleared';
        console.log(`🧹 Cleared collection: ${key}`);
      } catch (error) {
        results[key] = `error: ${error.message}`;
      }
    }

    return results;
  }
}

// Create and export singleton instance
const database = new Database();

// Export the instance and mongoose for flexibility
module.exports = {
  mongoose,
  connection: mongoose.connection,
  instance: database,

  // Helper functions
  connect: () => database._connect(),
  disconnect: () => database.close(),
  getStatus: () => database.getStatus(),
  dropDatabase: () => database.dropDatabase(),
  clearCollections: () => database.clearAllCollections(),

  // Common database operations
  startSession: () => mongoose.startSession(),
  withTransaction: async (operations) => {
    const session = await mongoose.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        result = await operations(session);
      });
      session.endSession();
      return result;
    } catch (error) {
      session.endSession();
      throw error;
    }
  }
};