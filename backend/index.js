import express from 'express';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import circuitsRoutes from './routes/circuitsRoutes.js';
import reservationsRoutes from './routes/reservationsRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/circuits', circuitsRoutes);
app.use('/api/reservations', reservationsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
