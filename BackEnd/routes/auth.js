const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('6780170653-md9te2utbr8o1fecvp0g02bj974q1gdp.apps.googleusercontent.com');

const jwtSecret = 'your_jwt_secret_key';
router.post('/register', async (req, res) => {
  const { username, password, role,department} = req.body;
  console.log(department);
  if(!username || !password)
    {
      return res.status(400).send("Enter all fields");  
    }
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      return res.status(400).send('User already exists');
    }
    userDepartment = department;
    if(department=='na'){
      userDepartment=role;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role,department) VALUES (?, ?, ?,?)';
    db.query(sql, [username, hashedPassword, role,userDepartment], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(201).send('User registered' );
    });
  });
});
router.post('/googleLogin', async (req, res) => {
  const { token } = req.body; 
  console.log("getting request");
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,  
      audience:'6780170653-md9te2utbr8o1fecvp0g02bj974q1gdp.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const email = payload['email'];
    const googleId = payload['sub'];

    
    const sql = 'SELECT * FROM google_authenticated_users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        return res.status(500).send('Server error');
      }

      if (results.length === 0) {
        return res.status(403).json({ error: 'User does not have access to any forms' });
      }

      const user = results[0];
      console.log("USER DATAAA BELLLLLOOWWWWW");
      console.log(user);
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, department: user.department, role: user.role },
        jwtSecret,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token });
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    return res.status(500).json({ error: 'Google authentication failed' });
  }
});



router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request for username:', username);
  if(!username || !password)
  {
      return res.status(400).send("Enter all fields");  
  }
  
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(400).send('Invalid credentials' );
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials' );
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, department: user.department,mail:user.mail },
      jwtSecret,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ token });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send('Token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid or expired token');
  }
}


router.get('/protected', verifyToken, (req, res) => {
  res.status(200).send(`Welcome, ${req.user.username}. You are authenticated as ${req.user.role}.`);
});
module.exports = router;
