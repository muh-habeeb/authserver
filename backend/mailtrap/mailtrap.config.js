import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAIL_TRAP_TOKEN;
const ENDPOINT = process.env.MAIL_TRAP_ENDPOINT;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  // endpoint: ENDPOINT, // not really required
});
// console.log("mailtrap token:", TOKEN);

export const sender = {
  email: process.env.MAIL_TRAP_SENDER_EMAIL,
  name: process.env.MAIL_TRAP_SENDER_NAME,
};