import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (error) {
    throw new Error("Failed to send verification email", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "91de5409-74ce-4b40-b99f-ca93123d2ccb",
      template_variables: {
        "company_info_name ": "Auth Services",
        name: name,
      },
    });
    console.log("done send");
  } catch (error) {
    throw new Error("Failed to send welcome email", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password Link",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password reset",
    });
  } catch (error) {
    throw new Error("error in send reset password", error);
  }
};

export const sendPasswordResetOkMail = async (email) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset",
    });
    console.log("done send");
  } catch (error) {
    throw new Error("Failed to send welcome email", error);
  }
};
