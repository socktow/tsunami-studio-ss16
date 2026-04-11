import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL_MONGODB;

if (!MONGODB_URI) {
  console.error('❌ Missing DATABASE_URL_MONGODB in environment variables');
  throw new Error('Missing DATABASE_URL_MONGODB in environment');
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

export async function testConnection() {
  try {
    const conn = await connectMongo();
    console.log('✅ MongoDB connection test successful');
    return { success: true, message: 'Connected successfully' };
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    return { success: false, message: error.message };
  }
}

export async function disconnectMongo() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 MongoDB disconnected');
  }
}