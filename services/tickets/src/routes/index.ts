import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    const tickets = await Ticket.find()
    res.send(tickets)
})

export { router as indexTicketRouter }
