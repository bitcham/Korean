import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}; 