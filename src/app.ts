import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/v1', routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Task Manager API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
