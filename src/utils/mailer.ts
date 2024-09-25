import nodemailer, { SendMailOptions } from "nodemailer";
import { config } from "../constants/env";
import logger from "./logger";

const smtp = {
  user: config.SMTP.USER,
  pass: config.SMTP.PASSWORD,
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  secure: config.SMTP.SECURE,
};

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

//

const getFromEmail = () =>
  config.NODE_ENV === "development" ? "test@example.com" : config.EMAIL_SENDER;

const sendEmail = async (payload: SendMailOptions) => {
  const emailPayload = {
    ...payload,
    from: getFromEmail(),
  };

  transporter.sendMail(emailPayload, (e, info) => {
    if (e) {
      logger.error(e, "Error sending email");
      return;
    }

    if (config.NODE_ENV === "development") {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  });
};

export default sendEmail;
