import { BadRequestError, NotFoundError, OrderStatus, requireAuth, UnauthorizedError, validateRequest } from "@germanyn-org/tickets-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { stripe } from "../libs/stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";

const router = Router()

router.post('',
    requireAuth,
    [
        body('token').not().isEmpty(),
        body('orderId').not().isEmpty(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body

        const order = await Order.findById(orderId)
        if (!order) {
            throw new NotFoundError()
        }

        if (order.userId !== req.currentUser!.id) {
            throw new UnauthorizedError()
        }

        if(order.status === OrderStatus.Canceled) {
            throw new BadRequestError('Cannot for cancelled order')
        }

        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'brl',
            source: token,
        })

        const payment = Payment.build({
            chargeId: charge.id,
            orderId: order.id,
        })
        await payment.save()

        res.status(201).send({
            id: payment.id,
            chargeId: payment.chargeId,
            orderId: payment.orderId,
        })
    },
)

export {
    router as createChargeRouter,
}