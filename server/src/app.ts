import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import logger from './utils/logger';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import koreanRoutes from './routes/api/koreanRoutes';

const app = express();

app.use(helmet());

app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));

app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev', {
    stream: {
        write: (message: string) => logger.http(message.trim())
    }
}));

app.get('/', (req, res) => {
    res.json({ message: 'Korean Learning API is running' });
});

// API routes
app.use('/api/korean', koreanRoutes);

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;


