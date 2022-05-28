const express = require('express');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');
const userRoute = require('./routes/user');
const todosRoutes = require('./routes/todos');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  next();
});

app.get('/', (req, res) => {
  return res.send('Worked');
});

app.use('/api', userRoute);
app.use('/api/todo', todosRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server listening on ${process.env.PORT}`);
});
