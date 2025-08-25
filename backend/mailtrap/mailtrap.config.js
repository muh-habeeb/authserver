import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAIL_TRAP_TOKEN;
const ENDPOINT = process.env.MAIL_TRAP_ENDPOINT;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT, // not really required
});
console.log("token:", TOKEN);

export const sender = {
  email: "hello@demomailtrap.co",
  name: "CODING WITH MAYAVI",
};


// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "<p>Congrats for sending test email with Mailtrap!</p>",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);