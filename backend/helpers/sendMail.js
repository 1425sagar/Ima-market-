import nodemailer from "nodemailer";
import "dotenv/config";

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use the correct port for Gmail
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from environment variables
    pass: process.env.EMAIL_PASS, // App password from environment variables
  },
});

// Send mail function
async function sendMail(to, text, html) {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"IMA Market" <${process.env.EMAIL_USER}>`, // Sender address
      to, // Receiver address
      subject: "Order Confirmation IMA Market", // Subject line
      text, // Plain text body
      html, // HTML body
    });

    console.log("Message sent: %s", info.messageId); // Log message ID
    return info;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error; // Propagate error for handling by the caller
  }
}
export { sendMail };
