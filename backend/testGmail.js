import { verifyGmailConnection, gmailTransporter, gmailSender } from "./mailing/gmail.config.js";
import dotenv from "dotenv";

dotenv.config();

const testGmailConnection = async () => {
  console.log("🔍 Testing Gmail Configuration...\n");
  
  // Check environment variables
  console.log("📧 Gmail User:", process.env.GMAIL_USER ? "✅ Set" : "❌ Missing");
  console.log("🔑 Gmail App Password:", process.env.GMAIL_APP_PASSWORD ? "✅ Set" : "❌ Missing");
  console.log("👤 Sender Name:", process.env.GMAIL_SENDER_NAME || "Auth Service (default)");
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("\n❌ Missing required environment variables!");
    console.log("Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file");
    return;
  }
  
  // Test connection
  console.log("\n🔗 Testing Gmail connection...");
  const isConnected = await verifyGmailConnection();
  
  if (isConnected) {
    console.log("\n🎉 Gmail is ready to send emails!");
    
    // Send a test email
    try {
      console.log("\n📤 Sending test email...");
      await gmailTransporter.sendMail({
        from: `${gmailSender.name} <${gmailSender.email}>`,
        to: process.env.GMAIL_USER, // Send to yourself
        subject: "Test Email - Auth Service",
        html: `
          <h2>🎉 Gmail Configuration Successful!</h2>
          <p>Your Gmail integration is working correctly.</p>
          <p>Time: ${new Date().toISOString()}</p>
          <p>This test email confirms that your authentication server can send emails via Gmail.</p>
        `
      });
      console.log("✅ Test email sent successfully!");
    } catch (error) {
      console.log("❌ Failed to send test email:", error.message);
    }
  } else {
    console.log("\n❌ Gmail configuration failed!");
    console.log("Please check your credentials and try again.");
  }
};

testGmailConnection();