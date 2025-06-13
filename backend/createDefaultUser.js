import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // adjust path if needed

dotenv.config();

const createCMOUser = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Check if CMO user already exists
    const existingUser = await User.findOne({ username: 'cmo_user' });
    if (existingUser) {
      console.log('⚠️ CMO user already exists');
      process.exit(0);
    }

    // 3. Create new CMO user
    const newUser = new User({
      username: 'cmo_user',
      password: 'helloworld', // plain password
      role: 'CMO',
      name: 'Chief Medical Officer',
      email: 'cmo@example.com',
      active: true,
    });

    // 4. Save user (password will be hashed automatically)
    await newUser.save();
    console.log('✅ CMO user created successfully with password: helloworld');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating CMO user:', error);
    process.exit(1);
  }
};

createCMOUser();
