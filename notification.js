const nodemailer = require("nodemailer");
const twilio = require("twilio");
require('dotenv').config();


// ------------------- EMAIL SETUP -------------------
async function sendEmail(session) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",    // 🔑 unga Gmail
        pass: "your-app-password",      // 🔑 App password (not normal password)
      },
    });

    let info = await transporter.sendMail({
      from: '"Counseling App" <yourgmail@gmail.com>',
      to: "iyyappanmani1247@gmail.com",   // 📩 Receiver mail
      subject: "📌 New Counseling Booking",
      text: `
      New counseling booking received:

      Name: ${session.name}
      Email: ${session.email}
      Phone: ${session.phone}
      Date: ${session.date}
      Time: ${session.time}
      `,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

// ------------------- WHATSAPP SETUP -------------------
const accountSid = "process.env.TWILIO_ACCOUNT_SID";    // Twilio Dashboard la irukkum
const authToken = "process.env.TWILIO_AUTH_TOKEN";    // Twilio Dashboard la irukkum
const client = require('twilio')(accountSid, authToken);

async function sendWhatsapp(session) {
  try {
    let msg = await client.messages.create({
      from: "whatsapp:+14155238886",    // Twilio sandbox number
      to: "whatsapp:+918248883272",     // ✅ unga WhatsApp number
      body: `📌 New Counseling Booking
Name: ${session.name}
Phone: ${session.phone}
Date: ${session.date}
Time: ${session.time}`,
    });

    console.log("✅ WhatsApp sent:", msg.sid);
  } catch (err) {
    console.error("❌ WhatsApp error:", err);
  }
}

// ------------------- EXPORT BOTH -------------------
async function sendNotification(session) {
  await sendEmail(session);
  await sendWhatsapp(session);
}

module.exports = sendNotification;
