const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authorization');
const jwt_decode = require('jwt-decode');

router.get('/', authenticateToken, async (req, res) => {
  try {
    let token = req.headers['authorization'].split(' ')[1];
    let result = jwt_decode(token);

    const response = await pool.query('SELECT * FROM users WHERE email=$1 ', [
      result.email,
    ]);
    if (response.rows.length > 0) {
      return res.json({ data: response.rows });
    }
  } catch (error) {
    return res.json({ Error: error.message });
  }
});

module.exports = router;
