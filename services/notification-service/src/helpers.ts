import { winstonLogger } from "okieloki-jobber-lib";
import { config } from "@notifications/config";
import { Logger } from "winston";
import nodeMailer, { Transporter } from "nodemailer";
import Email from "email-templates";
import path from "path";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "mailTransportHelper",
  "debug",
);

const emailTemplatesSendEmail = async (
  template: string,
  to: string,
  locals: any,
): Promise<void> => {
  try {
    const transporter: Transporter = nodeMailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: transporter,
      views: {
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "../dist"),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, "..", "src/templates/emails", template),
      message: {
        to: to,
      },
      locals: locals,
    });
  } catch (error) {
    log.error(error);
  }
};

export { emailTemplatesSendEmail };
