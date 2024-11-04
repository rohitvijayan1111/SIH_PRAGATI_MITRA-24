const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const hodEmailMapping = {
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
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rohitvijayandrive@gmail.com',
    pass: 'kfzxznsmouxvszel'
  }
});

router.post('/send', async (req, res) => {
  const { subject, to, desc } = req.body;
  console.log(req.body);
  const mailOptions = {
    from: { name: 'RMKEC UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: to,
    subject: `${subject}`,
    text: `${desc}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Form created and email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error creating form or sending email: ' + error);
  }
});


router.post('/notifyHOD', async (req, res) => {
  const { formSubject,department, emails} = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  console.log(department);
  emailList.push(hodEmailMapping[department]);
  console.log(emailList)
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: 'likesh12.7.2004@gmail.com', 
    subject: `Notification: New Hall Booking Request`,
    text: `${formSubject}` 
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to HOD');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});

router.post('/approveEventByHOD', async (req, res) => {
  const { formSubject,department, emails } = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  console.log(department);
  emailList.push(hodEmailMapping[department]);
  console.log(emailList)
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: ['like22050.it@rmkec.ac.in'], 
    subject: `Notification: New Hall Booking Form Approved by ${department} HOD`,
    text: `${formSubject}`,
    cc: emailList 
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to Academic Coordinator');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});

router.post('/approveEventByAcademicCoordinator', async (req, res) => {
  const { formSubject, department, emails } = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  emailList.push(hodEmailMapping[department]);
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: 'likeshkr2004@gmail.com',
    cc: emailList,
    subject: `Notification: Hall Booking Form Approved by Academic Coordinator`,
    text: `The hall booking form "${formSubject}" has been approved by Academic Coordinator.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to Principal and HOD');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});

router.post('/approveEventByPrincipal', async (req, res) => {
  const { formSubject,department,emails} = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  emailList.push(hodEmailMapping[department]);
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: 'likesh12.7.2004@gmail.com', 
    cc: ['broh22012.it@rmkec.ac.in','like22050.it@rmkec.ac.in'], 
    subject: `Notification: Hall Booking Form Approved by Principal`,
    text: `The hall booking form "${formSubject}" has been approved by Principal.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to HOD and Academic Coordinator');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});

router.post('/cancelEventByEventCoordinator', async (req, res) => {
  const { formSubject,department, emails } = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  console.log(department);
  emailList.push(hodEmailMapping[department]);
  console.log(emailList)
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: emailList, 
    subject: `Notification:Hall Booking Request is cancelled by ${department} Event Coordinator`,
    text: `${formSubject}`, 
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to HOD & Event Coordinator');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});
router.post('/cancelEventByHOD', async (req, res) => {
  const { formSubject,department, emails } = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  console.log(department);
  emailList.push(hodEmailMapping[department]);
  console.log(emailList)
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: emailList, 
    subject: `Notification:Hall Booking Request is cancelled by ${department} HOD`,
    text: `${formSubject}`,  
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to HOD & Event Coordinator');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});

router.post('/cancelEventByAcademicCoordinator', async (req, res) => {
  const { formSubject, department, emails } = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  emailList.push(hodEmailMapping[department]);
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: emailList,
    cc: 'like22050.it@rmkec.ac.in',
    subject: `Notification: Hall Booking Request is cancelled by Academic Coordinator`,
    text: `The hall booking form "${formSubject}" has been cancelled by Academic Coordinator.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to Principal and HOD');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});

router.post('/cancelEventByPrincipal', async (req, res) => {
  const { formSubject,department,emails} = req.body;
  const emailList = Array.isArray(emails) ? emails : [emails];
  emailList.push(hodEmailMapping[department]);
  const mailOptions = {
    from: { name: 'RMKEC HALL UPDATES', address: 'rohitvijayandrive@gmail.com' },
    to: emailList, 
    cc: ['broh22012.it@rmkec.ac.in','like22050.it@rmkec.ac.in'], 
    subject: `Notification: Hall Booking Request is cancelled by Principal`,
    text: `The hall booking form "${formSubject}" has been cancelled by Principal.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent to HOD and Academic Coordinator');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending notification email: ' + error);
  }
});
module.exports = router;
