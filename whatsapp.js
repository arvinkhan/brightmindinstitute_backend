import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

export function sendWA(message) {
  return client.messages.create({
    from: "whatsapp:+14155238886",
    to: "whatsapp:+918755211749",
    body: message
  });
}
