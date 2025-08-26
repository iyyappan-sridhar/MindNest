require('dotenv').config(); // load .env file

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from Twilio + dotenv',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.MY_PHONE_NUMBER
  })
  .then(message => console.log("✅ Message sent: ", message.sid))
  .catch(err => console.error("❌ Error: ", err));
