import { sequelize, User } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Count users
    const userCount = await User.count();
    console.log(`Found ${userCount} users in the database.`);
    
    // List users (limited to 5)
    if (userCount > 0) {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role'],
        limit: 5
      });
      console.log('Sample users:', JSON.stringify(users, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();
