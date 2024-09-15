import express, { Express } from 'express';
import { exceptionHandler } from './middlewares/exceptionsHandler';
import { studentController } from './controllers/student.controller';

const app: Express = express();
const port = 3001;

app.use(express.json());
app.use('/student', studentController);

// после контроллеров для перехвата ошибок
app.use(exceptionHandler);

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
