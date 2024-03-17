import { BadRequestError, ForbiddenError, NotFoundError, requireAuth, validateRequest } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../libs/nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";

const router = Router()

router.put(
    '/:id',
    [
        body('title')
            .notEmpty()
            .withMessage('Title must be valid'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    requireAuth,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) throw new NotFoundError()

        if (ticket.userId !== req.currentUser!.id) throw new ForbiddenError()

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket')
        }

        ticket.set({
            title:req.body.title,
            price:req.body.price,
        })

        await ticket.save()
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
        })

        res.send(ticket)
    },
)

export { router as updateTicketRouter }