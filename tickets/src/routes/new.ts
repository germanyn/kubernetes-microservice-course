import { requireAuth, validateRequest } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../libs/nats-wrapper";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/ticket";

const router = Router()

router.post(
    '',
    requireAuth,
    [
        body('title')
            .notEmpty()
            .withMessage('Title must be valid'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        })
        const createdTicket = await Ticket.create(ticket)
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: createdTicket.id,
            title: createdTicket.title,
            price: createdTicket.price,
            userId: createdTicket.userId,
            version: createdTicket.version,
        })
        res.status(201).send(createdTicket)
    },
)

export { router as createTicketRouter }