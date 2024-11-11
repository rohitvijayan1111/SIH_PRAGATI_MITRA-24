"use strict";

var express = require('express');

var bcrypt = require('bcryptjs');

var db = require('../config/db');

var jwt = require('jsonwebtoken');

var router = express.Router();

var _require = require('google-auth-library'),
    OAuth2Client = _require.OAuth2Client;

var client = new OAuth2Client('6780170653-md9te2utbr8o1fecvp0g02bj974q1gdp.apps.googleusercontent.com');
var jwtSecret = 'your_jwt_secret_key';
router.post('/register', function _callee2(req, res) {
  var _req$body, username, password, role, department;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role, department = _req$body.department;
          console.log(department);

          if (!(!username || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Enter all fields"));

        case 4:
          db.query('SELECT * FROM users WHERE username = ?', [username], function _callee(err, results) {
            var hashedPassword, sql;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 3;
                      break;
                    }

                    console.error(err);
                    return _context.abrupt("return", res.status(500).send('Server error'));

                  case 3:
                    if (!(results.length > 0)) {
                      _context.next = 5;
                      break;
                    }

                    return _context.abrupt("return", res.status(400).send('User already exists'));

                  case 5:
                    userDepartment = department;

                    if (department == 'na') {
                      userDepartment = role;
                    }

                    _context.next = 9;
                    return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

                  case 9:
                    hashedPassword = _context.sent;
                    sql = 'INSERT INTO users (username, password, role,department) VALUES (?, ?, ?,?)';
                    db.query(sql, [username, hashedPassword, role, userDepartment], function (err, result) {
                      if (err) {
                        console.error(err);
                        return res.status(500).send('Server error');
                      }

                      res.status(201).send('User registered');
                    });

                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.post('/googleLogin', function _callee3(req, res) {
  var token, ticket, payload, email, googleId, sql;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = req.body.token;
          console.log("getting request");
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(client.verifyIdToken({
            idToken: token,
            audience: '6780170653-md9te2utbr8o1fecvp0g02bj974q1gdp.apps.googleusercontent.com'
          }));

        case 5:
          ticket = _context3.sent;
          payload = ticket.getPayload();
          email = payload['email'];
          googleId = payload['sub'];
          sql = 'SELECT * FROM google_authenticated_users WHERE email = ?';
          db.query(sql, [email], function (err, results) {
            if (err) {
              return res.status(500).send('Server error');
            }

            if (results.length === 0) {
              return res.status(403).json({
                error: 'User does not have access to any forms'
              });
            }

            var user = results[0];
            console.log("USER DATAAA BELLLLLOOWWWWW");
            console.log(user);
            var token = jwt.sign({
              userId: user.id,
              email: user.email,
              department: user.department,
              role: user.role
            }, jwtSecret, {
              expiresIn: '1h'
            });
            return res.status(200).json({
              token: token
            });
          });
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](2);
          console.error('Error during Google login:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: 'Google authentication failed'
          }));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 13]]);
});
router.post('/login', function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;
  console.log('Received login request for username:', username);

  if (!username || !password) {
    return res.status(400).send("Enter all fields");
  }

  var sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], function _callee4(err, results) {
    var user, isMatch, token;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!err) {
              _context4.next = 3;
              break;
            }

            console.error(err);
            return _context4.abrupt("return", res.status(500).send('Server error'));

          case 3:
            if (!(results.length === 0)) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", res.status(400).send('Invalid credentials'));

          case 5:
            user = results[0];
            _context4.next = 8;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

          case 8:
            isMatch = _context4.sent;

            if (isMatch) {
              _context4.next = 11;
              break;
            }

            return _context4.abrupt("return", res.status(400).send('Invalid credentials'));

          case 11:
            token = jwt.sign({
              userId: user.id,
              username: user.username,
              role: user.role,
              department: user.department,
              mail: user.mail
            }, jwtSecret, {
              expiresIn: '1h'
            });
            res.status(200).json({
              token: token
            });

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
});

function verifyToken(req, res, next) {
  var token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is required for authentication');
  }

  try {
    var decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid or expired token');
  }
}

router.get('/protected', verifyToken, function (req, res) {
  res.status(200).send("Welcome, ".concat(req.user.username, ". You are authenticated as ").concat(req.user.role, "."));
});
module.exports = router;