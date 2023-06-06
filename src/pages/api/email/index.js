var nodemailer = require("nodemailer");

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { email, subject, message } = req.body;

  console.log({ email, message });

  var transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    bcc: process.env.BCC,
    subject: subject,
    text: `Hello from \n\n Memoryise`,
    html: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({
        data: "An error occurred while sending email. Please try again.",
      });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ data: "Email sent successfully" });
    }
  });
}

export default handler;
