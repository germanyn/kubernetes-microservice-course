import { BadRequestError, ForbiddenError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../libs/nats-wrapper";
import { Order } from "../models/order";

const router = Router()

router.patch(
    '/:id',
    requireAuth,
    body('status')
        .custom(status => !status || Object.values(OrderStatus).includes(status))
        .withMessage(`status must be one of: ${Object.values(OrderStatus).join(', ')}`),
    validateRequest,
    async (req: Request, res: Response) => {
        const newStatus = req.body.status

        const order = await Order.findById(req.params.id)
            .populate('ticket')
        if (!order) throw new NotFoundError()

        const oldStatus = order.status

        if (order.userId != req.currentUser!.id) {
            throw new ForbiddenError()
        }
        
        if (newStatus !== oldStatus && oldStatus === OrderStatus.Canceled) {
            throw new BadRequestError(`Order cannot be changed from ${OrderStatus.Canceled}`)
        }

        order.status = newStatus

        if (order.isModified()) {
            await order.save()

            if (newStatus !== oldStatus && oldStatus === OrderStatus.Canceled) {
                await new OrderCancelledPublisher(natsWrapper.client).publish({
                    id: order.id,
                    version: order.version,
                    ticket: {
                        id: order.ticket.id,
                    },
                })
            }
        }

        res.send(order)
    },
)

export { router as editOrderRouter }