"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var path = require('path');

var cors = require('cors');

var db = require('./config/db');

var cron = require('node-cron');

var app = express();
var PORT = process.env.PORT || 3000;

var nodemailer = require('nodemailer');

var moment = require('moment');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/uploads', express["static"](path.join(__dirname, 'uploads')));

var authRoutes = require('./routes/auth');

var userRoutes = require('./routes/users');

var clubActivitiesRoutes = require('./routes/clubActivities');

var guestLecturesRoutes = require('./routes/guestlecture');

var hallBookingsRoutes = require('./routes/hallbooking');

var notificationsRoutes = require('./routes/notifications');

var emailRoutes = require('./routes/emailsender');

var tablesRoutes = require('./routes/tables');

var graphRoutes = require('./routes/graph');

var formRoutes = require('./routes/forms');

var attendanceRoutes = require('./routes/attendance');

app.use('/auth', authRoutes);
app.use('/mail', emailRoutes);
app.use('/tables', tablesRoutes);
app.use('/graphs', graphRoutes);
app.use('/forms', formRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/hall', hallBookingsRoutes);
cron.schedule('0 0 * * *', function () {
  console.log('Cron job triggered every minute.');
  var resetQuery = "\n    UPDATE membercount\n    SET \n      todayabsentcount_year_I = 0,\n      todayabsentcount_year_II = 0,\n      todayabsentcount_year_III = 0,\n      todayabsentcount_year_IV = 0,\n      todayabsentcount_staff = 0,\n      hostellercount_year_I=0,\n      hostellercount_year_II=0,\n      hostellercount_year_III=0,\n      hostellercount_year_IV=0;\n  ";
  db.query(resetQuery, function (error, results, fields) {
    if (error) {
      console.error('Error resetting counts:', error.message);
    } else {
      console.log('Counts reset successfully.');
    }
  });
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rohitvijayandrive@gmail.com',
    pass: 'kfzxznsmouxvszel'
  }
});

var sendMail = function sendMail(email, formTitle, deadline) {
  var formattedDeadline = moment(deadline).format('HH:mm:ss DD/MM/YYYY');
  var mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: "Reminder: ".concat(formTitle, " Form Submission"),
    text: "Dear HOD,\n\nWe noticed that you haven't yet submitted the form titled \"".concat(formTitle, "\". Please be reminded that the deadline for submission is on ").concat(formattedDeadline, ".\n\nWe kindly request you to complete and submit the form at your earliest convenience.\n\nThank you for your attention to this matter.\n\nBest regards,\nThe Coordination Team")
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email to:', email, error);
    } else {
      console.log('Email sent to:', email, info.response);
    }
  });
}; // Function to process form locks and send emails


var processFormLocks = function processFormLocks() {
  db.query('SELECT * FROM form_locks WHERE not_submitted_emails IS NOT NULL', function (err, results) {
    if (err) {
      console.error('Error fetching data from form_locks:', err);
      return;
    }

    results.forEach(function (row) {
      var emails = row.not_submitted_emails.split(','); // Convert the comma-separated emails into an array

      var formTitle = row.form_title;
      var deadline = row.deadline;
      console.log(emails);
      emails.forEach(function (email) {
        sendMail(email.trim(), formTitle, deadline); // Send mail to each email
      });
    });
  });
};

cron.schedule('0 */4 * * *', function () {
  console.log('Running cron job to send emails to not_submitted_emails');
  processFormLocks();
});
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});