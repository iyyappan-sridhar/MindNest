// notification.js

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const toNumber   = process.env.MY_PHONE_NUMBER;

if (!accountSid || !authToken) {
  console.error("❌ Missing Twilio credentials. Please check Render Environment Variables.");
}

const client = require("twilio")(accountSid, authToken);

// Reusable function to send notifications
async function sendNotification(session) {
  try {
    const message = await client.messages.create({
      body: `Hello ${session.name}, your counseling session is booked ✅\nDate: ${session.date} Time: ${session.time}`,
      from: fromNumber,   // Twilio number (SMS or WhatsApp)
      to: toNumber        // Your number (SMS or WhatsApp)
    });

    console.log("✅ Message sent:", message.sid);
  } catch (err) {
    console.error("❌ Twilio error:", err);
  }
}

module.exports = sendNotification;
