import { ForbiddenError, NotFoundError, requireAuth, UnauthorizedError } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

const router = Router()

router.get(
    '/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order
            .findById(req.params.id)
            .populate('ticket')
        if (!order) throw new NotFoundError()
        if (order.userId != req.currentUser!.id)
            throw new ForbiddenError()
        res.send(order)
    },
)

export { router as showOrderRouter }