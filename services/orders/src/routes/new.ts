import { BadRequestError, OrderStatus, requireAuth, validateRequest } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Types } from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../libs/nats-wrapper";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = Router()

// const EXPIRATION_DURATION_SECONDS = 1 * 15;
const EXPIRATION_DURATION_SECONDS = 15 * 60;

router.post(
    '/',
    requireAuth,
    [
        body('ticketId')
            .notEmpty()
            .custom(value => Types.ObjectId.isValid(value))
            .withMessage('TicketId must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Find the ticket
        const { ticketId } = req.body

        const ticket = await Ticket.findById(ticketId)
        if (!ticket) throw new BadRequestError('Ticket not found')

        // make sure not reserved
        const isReserved = await ticket.isReserved()
        if (isReserved) throw new BadRequestError('Ticket already reserved')

        // calculate an expiration date
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_DURATION_SECONDS)

        // build the orrder and save
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt,
            ticket: ticket._id,
        })
        await order.save()

        await order.populate('ticket')

        // publish event saying order is created
        await new OrderCreatedPublisher(natsWrapper.client)
            .publish({
                id: order.id,
                version: order.version,
                status: order.status,
                userId: order.userId,
                expiresAt: order.expiresAt.toISOString(),
                ticket: {
                    id: order.ticket.id,
                    price: order.ticket.price,
                },
            })

        res.status(201).send(order)
    }
)

export { router as createOrderRouter }