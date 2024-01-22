import express from 'express';
import Todo from '../schemas/todo.schema.js';

const router = express.Router();

router.get('/todo', async (req, res) => {
  const todos = await Todo.find()
    .select('title author status createdAt')
    .sort('-createdAt')
    .exec();

  res.render('todos', { todos }); // 'todos'를 전달합니다.
});

router.post('/todos', async (req, res) => {
  const { title, content, author, password, order } = req.body;

  if (!title || !content || !author || !password) {
    return res
      .status(400)
      .json({ errorMessage: '데이터 형식이 어쩌고 저쩌고' });
  }

  const todoMaxOrder = await Todo.findOne().sort('-order').exec();
  const newOrder = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

  const todo = new Todo({
    title,
    content,
    author,
    password,
    order: newOrder,
  });
  await todo.save();

  return res.status(201).json({ message: '등록 성공' });
});

router.post('/todo/:id', async function (req, res) {
  const updatedTodo = {
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
  };

  try {
    const todo = await Todo.findById(req.params.id);

    if (todo.password !== req.body.password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    await Todo.findByIdAndUpdate(req.params.id, updatedTodo);
    res.json({ message: '수정 성공' }); //
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '수정 실패' }); //
  }
});

router.delete('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;
  const { password } = req.body;

  try {
    const todo = await Todo.findById(todoId);

    if (!todo || todo.password !== password) {
      return res
        .status(401)
        .json({ message: '삭제 실패: 비밀번호가 일치하지 않습니다.' });
    }

    await Todo.findByIdAndDelete(todoId);
    res.status(200).json({ message: '삭제 성공' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '삭제 실패: 서버 오류' });
  }
});
export default router;
