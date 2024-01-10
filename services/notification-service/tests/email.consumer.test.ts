import * as connection from '@notifications/queues/connection'
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer'
import amqp from 'amqplib'

jest.mock('@notifications/queues/connection')
jest.mock('amqplib')
jest.mock('okieloki-jobber-lib')

describe('Email Consumer', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('consumeAuthEmailMessages Method', () => {
        it('should be called', async () => {
            const channel = {
                assertExchange: jest.fn(),
                publish: jest.fn(),
                consume: jest.fn(),
                assertQueue: jest.fn(),
                bindQueue: jest.fn(),
            }

            jest.spyOn(channel, 'assertExchange')
            jest.spyOn(channel, 'assertQueue').mockReturnValue({
                queue: 'auth-email-queue',
                messageCount: 0,
                consumerCount: 0,
            })
            jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never)

            const connectionChannel: amqp.Channel | undefined = await connection.createConnection()

            await consumeAuthEmailMessages(connectionChannel)

            expect(connectionChannel.assertExchange).toHaveBeenCalledWith('jobber-email-notification', 'direct')

            expect(connectionChannel.assertQueue).toHaveBeenCalledWith('auth-email-queue', {
                durable: true,
                autoDelete: false,
            })

            expect(connectionChannel.consume).toHaveBeenCalledTimes(1)

            expect(connectionChannel.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobber-email-notification', 'auth-email')
        })
    })
})
