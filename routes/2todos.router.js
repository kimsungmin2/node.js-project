import express from 'express';
import Todo from '../schemas/2todo.schema.js';

const router = express.Router();

router.get('/todos', async (req, res) => {
  const todos = await Todo.find()
    .select('title author status createdAt')
    .sort('-createdAt')
    .exec();

  return res.status(200).json({ todos });
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

router.get('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId)
    .select('title content author status createdAt')
    .exec();

  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 상품 데이터 어쩌고 저쪼고.' });
  }

  return res.status(200).json({ todo });
});

router.put('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;
  const { title, content, status, password } = req.body;

  const todo = await Todo.findById(todoId).exec();
  if (!title || !content || !password || !status) {
    return res
      .status(400)
      .json({ errorMessage: '데이터 형식이 어쩌고 저쩌고' });
  }

  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: '상품 조회에 실패하였습니다.' });
  }

  if (todo.password !== password) {
    return res
      .status(401)
      .json({ errorMessage: '상품을 수정할 권한이 존재하지 않습니다.' });
  }

  if (title) {
    todo.title = title;
  }

  if (content) {
    todo.content = content;
  }

  if (status) {
    todo.status = status;
  }

  await todo.save();

  return res.status(200).json({ message: '상품 정보가 수정 됬읖니다.' });
});

router.delete('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;
  const { password } = req.body;

  const todo = await Todo.findById(todoId).exec();
  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: '상품 조회에 실패하였습니다.' });
  }

  if (todo.password !== password) {
    return res
      .status(401)
      .json({ errorMessage: '상품을 수정할 권한이 존재하지 않습니다.' });
  }

  await Todo.deleteOne({ _id: todoId });

  return res.status(200).json({ message: '상품 정보가 삭제 됬읖니다.' });
});

export default router;
