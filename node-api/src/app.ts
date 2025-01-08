import express from 'express';
import bodyParser from 'body-parser';
import tasksRoutes from './routes/tasksRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/tasks', tasksRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

export default app;
