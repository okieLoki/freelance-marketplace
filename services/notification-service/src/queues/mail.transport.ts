import { IEmailLocals, winstonLogger } from "okieloki-jobber-lib";
import { Logger } from "winston";
import { config } from "@notifications/config";
import { emailTemplatesSendEmail } from "@notifications/helpers";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "mailTransport",
  "debug",
);

const sendEmail = async (
  template: string,
  recieverEmail: string,
  locals: IEmailLocals,
): Promise<void> => {
  try {
    await emailTemplatesSendEmail(template, recieverEmail, locals);
  } catch (error) {
    log.log("error", "NotificationService sendEmail() method:", error);
  }
};

export { sendEmail };
