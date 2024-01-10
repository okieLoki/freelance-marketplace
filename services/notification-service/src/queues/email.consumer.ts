import { Channel, ConsumeMessage } from "amqplib";
import { IEmailLocals, winstonLogger } from "okieloki-jobber-lib";
import { config } from "@notifications/config";
import { Logger } from "winston";
import { createConnection } from "@notifications/queues/connection";
import { sendEmail } from "@notifications/queues/mail.transport";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "emailConsumer",
  "debug",
);

const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }

    const exhangeName: string = "jobber-email-notification";
    const routingKey: string = "auth-email";
    const queueName: string = "auth-email-queue";

    await channel.assertExchange(exhangeName, "direct");

    const queue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });

    await channel.bindQueue(queue.queue, exhangeName, routingKey);

    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      const { recieverEmail, username, verifyLink, resetLink, template } =
        JSON.parse(msg!.content.toString());

      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: "https://i.ibb.co/Kyp2m0t/cover.png",
        username,
        verifyLink,
        resetLink,
      };

      await sendEmail(template, recieverEmail, locals).then(() => {
        log.info(`Email sent to ${recieverEmail} successfully`);
      });

      channel.ack(msg);
    });
  } catch (error) {
    log.log(
      "error",
      "NotificationService consumeAuthEmailMessages() method:",
      error,
    );
  }
};

const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection();
    }

    const exchangeName: string = "jobber-order-notification";
    const routingKey: string = "order-email";
    const queueName: string = "order-email-queue";

    await channel.assertExchange(exchangeName, "direct");
    const queue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });

    await channel.bindQueue(queue.queue, exchangeName, routingKey);

    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      } = JSON.parse(msg!.content.toString());

      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: "https://i.ibb.co/Kyp2m0t/cover.png",
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      };

      if (template === "orderPlaced") {
        Promise.all([
          sendEmail("orderPlaced", receiverEmail, locals),
          sendEmail("orderReceipt", receiverEmail, locals),
        ]).then(() => {
          log.info(`Emails sent to ${receiverEmail} successfully`);
        });
      } else {
        await sendEmail(template, receiverEmail, locals).then(() => {
          log.info(`Email sent to ${receiverEmail} successfully`);
        });
      }
      channel.ack(msg);
    });
  } catch (error) {
    log.log("error", "NotificationService consumeOrderEmail() method:", error);
  }
};

export { consumeAuthEmailMessages, consumeOrderEmailMessages };
