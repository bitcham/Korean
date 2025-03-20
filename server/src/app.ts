import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Get environment variables
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Set up CORS
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

//CORS config
app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Routes for React Frontend
app.use('/api', koreanRoutes);




const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


