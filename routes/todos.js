const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authorization');
const todoControler = require('../contollers/todo');

router.get('/alltodos', authenticateToken, todoControler.getAllTodo);
router.get(
  '/alltodos/completed',
  authenticateToken,
  todoControler.getAllCompletedTodos
);
router.post('/addtodo', authenticateToken, todoControler.addTodo);
router.put('/:id', authenticateToken, todoControler.syncTodo);
router.put('/complete/:id', authenticateToken, todoControler.completeTask);
router.put('/undo/:id', authenticateToken, todoControler.undoTodo);
router.delete('/:id', authenticateToken, todoControler.deleteTodo);

module.exports = router;
