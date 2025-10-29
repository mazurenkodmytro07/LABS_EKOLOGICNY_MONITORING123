import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import stationsRouter from './routes/stations.routes.js';
import measRouter from './routes/meas.routes.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ success: true, data: 'OK' }));

app.use('/api/stations', stationsRouter);
app.use('/api/measurements', measRouter);

app.use(notFound);
app.use(errorHandler);

export default app;