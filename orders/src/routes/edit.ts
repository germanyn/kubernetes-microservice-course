import { BadRequestError, ForbiddenError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { OrderUpdatedPublisher } from "../events/publishers/order-updated-publisher";
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
        const order = await Order.findById(req.params.id)
            .populate('ticket')
        if (!order) throw new NotFoundError()
        if (order.userId != req.currentUser!.id)
            throw new ForbiddenError()

        if (req.body.status) {
            if (req.body.status !== order.status) {
                if (order.status === OrderStatus.Canceled)
                    throw new BadRequestError(`Order cannot be changed from ${OrderStatus.Canceled}`)
                order.status = req.body.status
            }
        }

        if (order.isModified()) {
            const changes = order.getChanges().$set
            await order.save()
            if (changes) {
                await new OrderUpdatedPublisher(natsWrapper.client).publish({
                    id: order.id,
                    version: order.version,
                    status: changes.status,
                })
            }
        }

        res.send(order)
    },
)

export { router as editOrderRouter }