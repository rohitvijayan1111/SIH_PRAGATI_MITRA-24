"use strict";

var express = require('express');

var nodemailer = require('nodemailer');

var router = express.Router();
var hodEmailMapping = {
  "Artificial Intelligence and Data Science": "rohitvijayan1111@gmail.com",
  "Civil Engineering": "rohitvijayan1111@gmail.com",
  "Computer Science and Business Systems": "rohitvijayan1111@gmail.com",
  "Computer Science and Design": "rohitvijayan1111@gmail.com",
  "Computer Science and Engineering": "rohitvijayan1111@gmail.com",
  "Electrical and Electronics Engineering": "rohitvijayan1111@gmail.com",
  "Electronics and Communication Engineering": "rohitvijayan1111@gmail.com",
  "Electronics and Instrumentation Engineering": "rohitvijayan1111@gmail.com",
  "Information Technology": "rohitvijayan1111@gmail.com",
  "Mechanical Engineering": "rohitvijayan1111@gmail.com"
};
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rohitvijayandrive@gmail.com',
    pass: 'kfzxznsmouxvszel'
  }
});
router.post('/send', function _callee(req, res) {
  var _req$body, subject, to, desc, mailOptions;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, subject = _req$body.subject, to = _req$body.to, desc = _req$body.desc;
          console.log(req.body);
          mailOptions = {
            from: {
              name: 'RMKEC UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: to,
            subject: "".concat(subject),
            text: "".concat(desc)
          };
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 6:
          res.status(200).send('Form created and email sent');
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          console.error('Error sending email:', _context.t0);
          res.status(500).send('Error creating form or sending email: ' + _context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/notifyHOD', function _callee2(req, res) {
  var _req$body2, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, formSubject = _req$body2.formSubject, department = _req$body2.department, emails = _req$body2.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          console.log(department);
          emailList.push(hodEmailMapping[department]);
          console.log(emailList);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: 'likesh12.7.2004@gmail.com',
            subject: "Notification: New Hall Booking Request",
            text: "".concat(formSubject)
          };
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 9:
          res.status(200).send('Notification email sent to HOD');
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](6);
          console.error('Error sending email:', _context2.t0);
          res.status(500).send('Error sending notification email: ' + _context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
router.post('/approveEventByHOD', function _callee3(req, res) {
  var _req$body3, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, formSubject = _req$body3.formSubject, department = _req$body3.department, emails = _req$body3.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          console.log(department);
          emailList.push(hodEmailMapping[department]);
          console.log(emailList);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: ['like22050.it@rmkec.ac.in'],
            subject: "Notification: New Hall Booking Form Approved by ".concat(department, " HOD"),
            text: "".concat(formSubject),
            cc: emailList
          };
          _context3.prev = 6;
          _context3.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 9:
          res.status(200).send('Notification email sent to Academic Coordinator');
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](6);
          console.error('Error sending email:', _context3.t0);
          res.status(500).send('Error sending notification email: ' + _context3.t0);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
router.post('/approveEventByAcademicCoordinator', function _callee4(req, res) {
  var _req$body4, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body4 = req.body, formSubject = _req$body4.formSubject, department = _req$body4.department, emails = _req$body4.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          emailList.push(hodEmailMapping[department]);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: 'likeshkr2004@gmail.com',
            cc: emailList,
            subject: "Notification: Hall Booking Form Approved by Academic Coordinator",
            text: "The hall booking form \"".concat(formSubject, "\" has been approved by Academic Coordinator.")
          };
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).send('Notification email sent to Principal and HOD');
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](4);
          console.error('Error sending email:', _context4.t0);
          res.status(500).send('Error sending notification email: ' + _context4.t0);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/approveEventByPrincipal', function _callee5(req, res) {
  var _req$body5, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body5 = req.body, formSubject = _req$body5.formSubject, department = _req$body5.department, emails = _req$body5.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          emailList.push(hodEmailMapping[department]);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: 'likesh12.7.2004@gmail.com',
            cc: ['broh22012.it@rmkec.ac.in', 'like22050.it@rmkec.ac.in'],
            subject: "Notification: Hall Booking Form Approved by Principal",
            text: "The hall booking form \"".concat(formSubject, "\" has been approved by Principal.")
          };
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).send('Notification email sent to HOD and Academic Coordinator');
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](4);
          console.error('Error sending email:', _context5.t0);
          res.status(500).send('Error sending notification email: ' + _context5.t0);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/cancelEventByEventCoordinator', function _callee6(req, res) {
  var _req$body6, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body6 = req.body, formSubject = _req$body6.formSubject, department = _req$body6.department, emails = _req$body6.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          console.log(department);
          emailList.push(hodEmailMapping[department]);
          console.log(emailList);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: emailList,
            subject: "Notification:Hall Booking Request is cancelled by ".concat(department, " Event Coordinator"),
            text: "".concat(formSubject)
          };
          _context6.prev = 6;
          _context6.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 9:
          res.status(200).send('Notification email sent to HOD & Event Coordinator');
          _context6.next = 16;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](6);
          console.error('Error sending email:', _context6.t0);
          res.status(500).send('Error sending notification email: ' + _context6.t0);

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
router.post('/cancelEventByHOD', function _callee7(req, res) {
  var _req$body7, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body7 = req.body, formSubject = _req$body7.formSubject, department = _req$body7.department, emails = _req$body7.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          console.log(department);
          emailList.push(hodEmailMapping[department]);
          console.log(emailList);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: emailList,
            subject: "Notification:Hall Booking Request is cancelled by ".concat(department, " HOD"),
            text: "".concat(formSubject)
          };
          _context7.prev = 6;
          _context7.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 9:
          res.status(200).send('Notification email sent to HOD & Event Coordinator');
          _context7.next = 16;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](6);
          console.error('Error sending email:', _context7.t0);
          res.status(500).send('Error sending notification email: ' + _context7.t0);

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
router.post('/cancelEventByAcademicCoordinator', function _callee8(req, res) {
  var _req$body8, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body8 = req.body, formSubject = _req$body8.formSubject, department = _req$body8.department, emails = _req$body8.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          emailList.push(hodEmailMapping[department]);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: emailList,
            cc: 'like22050.it@rmkec.ac.in',
            subject: "Notification: Hall Booking Request is cancelled by Academic Coordinator",
            text: "The hall booking form \"".concat(formSubject, "\" has been cancelled by Academic Coordinator.")
          };
          _context8.prev = 4;
          _context8.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).send('Notification email sent to Principal and HOD');
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](4);
          console.error('Error sending email:', _context8.t0);
          res.status(500).send('Error sending notification email: ' + _context8.t0);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
router.post('/cancelEventByPrincipal', function _callee9(req, res) {
  var _req$body9, formSubject, department, emails, emailList, mailOptions;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body9 = req.body, formSubject = _req$body9.formSubject, department = _req$body9.department, emails = _req$body9.emails;
          emailList = Array.isArray(emails) ? emails : [emails];
          emailList.push(hodEmailMapping[department]);
          mailOptions = {
            from: {
              name: 'RMKEC HALL UPDATES',
              address: 'rohitvijayandrive@gmail.com'
            },
            to: emailList,
            cc: ['broh22012.it@rmkec.ac.in', 'like22050.it@rmkec.ac.in'],
            subject: "Notification: Hall Booking Request is cancelled by Principal",
            text: "The hall booking form \"".concat(formSubject, "\" has been cancelled by Principal.")
          };
          _context9.prev = 4;
          _context9.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).send('Notification email sent to HOD and Academic Coordinator');
          _context9.next = 14;
          break;

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](4);
          console.error('Error sending email:', _context9.t0);
          res.status(500).send('Error sending notification email: ' + _context9.t0);

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
module.exports = router;