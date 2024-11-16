const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('./config/db'); 
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 3000;
const nodemailer = require('nodemailer');
const moment = require('moment');
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' })); // Increase limit for JSON bodies
app.use(express.urlencoded({ limit: '10mb', extended: true })); //


const authRoutes = require('./routes/auth');
const clubActivitiesRoutes = require('./routes/clubActivities');
const guestLecturesRoutes = require('./routes/guestlecture');
const hallBookingsRoutes = require('./routes/hallbooking');
const notificationsRoutes = require('./routes/notifications');
const emailRoutes = require('./routes/emailsender');
const tablesRoutes = require('./routes/tables');
const graphRoutes = require('./routes/graph');
const formRoutes = require('./routes/forms');
const attendanceRoutes = require('./routes/attendance');
const excelUploadRoutes = require('./routes/excel');
const gform = require('./routes/gform');
const chat = require('./routes/chat');
const dbimport = require('./routes/dbimport');const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/datareport');
const nondeptRoutes=require("./routes/tablesfornondept");
app.use('/auth', authRoutes);
app.use('/mail', emailRoutes);
app.use('/tables', tablesRoutes);
app.use('/graphs', graphRoutes);
app.use('/forms', formRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/hall', hallBookingsRoutes);
app.use('/excel', excelUploadRoutes);
app.use('/gform', gform);
app.use('/chat', chat);
app.use('/db', dbimport);
app.use('/dashboard', dashboardRoutes);
app.use("/tablesfornondept",nondeptRoutes);
app.use('/report', reportRoutes);
cron.schedule('0 0 * * *', () => {
  console.log('Cron job triggered every minute.');

  const resetQuery = `
    UPDATE membercount
    SET 
      todayabsentcount_year_I = 0,
      todayabsentcount_year_II = 0,
      todayabsentcount_year_III = 0,
      todayabsentcount_year_IV = 0,
      todayabsentcount_staff = 0,
      hostellercount_year_I=0,
      hostellercount_year_II=0,
      hostellercount_year_III=0,
      hostellercount_year_IV=0;
  `;

  db.query(resetQuery, (error, results, fields) => {
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


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rohitvijayandrive@gmail.com',
    pass: 'kfzxznsmouxvszel'
  }
});

const sendMail = (email, formTitle, deadline) => {
  const formattedDeadline = moment(deadline).format('HH:mm:ss DD/MM/YYYY');

  const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: `Reminder: ${formTitle} Form Submission`,
      text: `Dear HOD,

We noticed that you haven't yet submitted the form titled "${formTitle}". Please be reminded that the deadline for submission is on ${formattedDeadline}.

We kindly request you to complete and submit the form at your earliest convenience.

Thank you for your attention to this matter.

Best regards,
The Coordination Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error sending email to:', email, error);
      } else {
          console.log('Email sent to:', email, info.response);
      }
  });
};

// Function to process form locks and send emails
const processFormLocks = () => {
  db.query('SELECT * FROM form_locks WHERE not_submitted_emails IS NOT NULL', (err, results) => {
      if (err) {
          console.error('Error fetching data from form_locks:', err);
          return;
      }

      results.forEach(row => {
          const emails = row.not_submitted_emails.split(','); // Convert the comma-separated emails into an array
          const formTitle = row.form_title;
          const deadline = row.deadline;
          console.log(emails);
          emails.forEach(email => {
              sendMail(email.trim(), formTitle, deadline); // Send mail to each email
          });
      });
  });
};

cron.schedule('0 */4 * * *', () => {
  console.log('Running cron job to send emails to not_submitted_emails');
  processFormLocks();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
