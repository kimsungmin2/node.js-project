import express from 'express';
import connect from './schemas/index.js';
import TodosRouter from './routes/todos.router.js';
import Todo from './schemas/todo.schema.js';

const app = express();
const PORT = 3000;

connect();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = express.Router();

app.get('/', async (req, res) => {
  const todos = await Todo.find().exec();
  res.render('index', { todos });
});

app.get('/', function (req, res) {
  res.render('index', { todos: todos });
});

app.use('/', [router, TodosRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
