import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { startScheduler } from './cron/scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);

startScheduler();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
