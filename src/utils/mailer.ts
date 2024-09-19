import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import logger from "./logger";
// const crateTestCreds = async () => {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// };

// crateTestCreds();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (e, info) => {
    if (e) {
      logger.error(e, "Error sending email");
      return;
    }

    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
