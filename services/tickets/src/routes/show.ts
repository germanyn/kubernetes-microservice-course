import { NotFoundError } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";

const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) throw new NotFoundError()

    res.send(ticket)
})

export { router as showTicketRouter }