const pool = require('../db');

module.exports.getAllTodo = async (req, res) => {
  try {
    const response = await pool.query(
      'SELECT * FROM todo WHERE user_id=$1 AND completed=$2 ORDER BY date_created',
      [req.user.user_id, false]
    );
    return res.status(201).json({ AllTodos: response.rows });
  } catch (error) {
    return res.json({ Error: error.message });
  }
};

module.exports.getAllCompletedTodos = async (req, res) => {
  try {
    const response = await pool.query(
      'SELECT * FROM todo WHERE user_id=$1 AND completed=$2 ORDER BY date_created DESC',
      [req.user.user_id, true]
    );
    return res.status(201).json({ AllTodos: response.rows });
  } catch (error) {
    return res.json({ Error: error.message });
  }
};

module.exports.addTodo = async (req, res) => {
  try {
    const { title, description, date_created } = req.body;
    const response = await pool.query(
      'INSERT INTO todo(user_id,title,description,date_created) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.user_id, title, description, date_created]
    );
    return res.status(201).json({ todo: response.rows[0] });
  } catch (error) {
    return res.json({ Error: error.message });
  }
};

module.exports.completeTask = async (req, res) => {
  try {
    const todo_id = req.params.id;
    await pool.query('UPDATE todo SET completed=$1 WHERE todo_id=$2', [
      true,
      todo_id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.undoTodo = async (req, res) => {
  try {
    const todo_id = req.params.id;
    await pool.query('UPDATE todo SET completed=$1 WHERE todo_id=$2', [
      false,
      todo_id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.syncTodo = async (req, res) => {
  try {
    const todo_id = req.params.id;
    const { title, description, date_created } = req.body;
    const response = await pool.query(
      'UPDATE todo SET title=$1,description=$2,date_created=$3 WHERE todo_id=$4 RETURNING *',
      [title, description, date_created, todo_id]
    );
    return res.json({ todoUpdated: response.rows[0] });
  } catch (error) {
    return res.json({ Error: error.message });
  }
};

module.exports.deleteTodo = async (req, res) => {
  try {
    const todo_id = req.params.id;

    await pool.query('DELETE FROM todo WHERE todo_id=$1', [todo_id]);
    return res.sendStatus(200);
  } catch (error) {
    return res.json({ Error: error.message });
  }
};
