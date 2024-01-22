import express from 'express';
import connect from './schemas/2index.js';
import TodosRouter from './routes/2todos.router.js';

const app = express();
const PORT = 4000;

connect();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = express.Router();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/todos', (req, res) => {
  res.render('todos');
});

app.use('/api', [router, TodosRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
