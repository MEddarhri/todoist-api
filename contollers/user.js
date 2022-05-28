const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const jwt_decode = require('jwt-decode');

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const results = await pool.query('SELECT * FROM users WHERE email=$1', [
      email,
    ]);
    if (results.rows.length == 0) {
      return res.status(401).send({ message: 'Email not registered.' });
    }
    if (await bcrypt.compare(password, results.rows[0].password)) {
      const accessToken = jwt.sign(
        {
          user_id: results.rows[0].user_id,
          full_name: results.rows[0].full_name,
          email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '10m',
        }
      );
      const refreshToken = jwt.sign(
        { email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      //   await pool.query('UPDATE users SET refresh_token = $1 WHERE email = $2', [
      //     refreshToken,
      //     email,
      //   ]);
      res.cookie('jwt', refreshToken, {
        maxAge: 15 * 60 * 1000,
      });
      return res.json({
        user: {
          id: results.rows[0].id,
          full_name: results.rows[0].full_name,
          email,
          accessToken,
        },
      });
    } else {
      return res.status(401).send({ message: 'Wrong password.' });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    let { full_name, email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email],
      (err, results) => {
        if (err) res.statusCode(400).json({ message: 'Failed to fetch.' });
        if (results.rows.length > 0) {
          return res.status(400).json({
            message: 'Email already exists, please try with another one.',
          });
        } else {
          pool.query(
            'INSERT INTO users (full_name,email,password) VALUES ($1,$2,$3)',
            [full_name, email, hashedPassword],
            (err, results) => {
              if (err) {
                return res.json({
                  message:
                    'An error has occured while sending this request ,please try again later.',
                });
              }
              return res.status(201).json({});
            }
          );
        }
      }
    );
  } catch (error) {
    console.log('entered');
    return res.json({ Error: error.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    let token = req.headers['authorization'].split(' ')[1];
    let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const response = await pool.query(
      'SELECT user_id,full_name,email FROM users WHERE user_id=$1 ',
      [payload.user_id]
    );
    if (response.rows.length > 0) {
      return res.json({ details: { ...response.rows[0], accessToken: token } });
    }
  } catch (error) {
    return res.json({ Error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let token = req.headers['authorization'].split(' ')[1];
    let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let newEmail = req.body.email || payload.email;
    let newFullName = req.body.full_name || payload.full_name;
    await pool.query('UPDATE users SET full_name=$1,email=$2 WHERE id=$3', [
      newFullName,
      newEmail,
      payload.id,
    ]);

    return res.status(201).json({});
  } catch (error) {
    return res.json({ Error: error.message });
  }
};
