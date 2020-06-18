const config = require('config');

exports.sendMail = (email, subject, html) => {
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.get('email'),
      pass: config.get('pass'),
    },
  });

  var mailOptions = {
    from: config.get('email'),
    to: email,
    subject: subject,
    html: html,
  };
  return transporter.sendMail(mailOptions);
};
