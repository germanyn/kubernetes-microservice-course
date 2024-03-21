import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useRequest } from '../../hooks/useRequest'
import { CreateOrderParams, Order } from "../../shared/types"
import { CustomPageContext } from "../_app"
import StripeCheckout, { Token } from "react-stripe-checkout"
import Router from "next/router"

const OrderShow: NextPage<OrderShowParams> = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0)

    const { execute, errors } = useRequest<Order, CreateOrderParams>({
        url: '/api/payments',
        method: 'post',
        onSuccess: () => Router.push('/orders'),
    })

    function handlePayment(token: Token) {
        execute({
            orderId: order.id,
            token: token.id,
        })
    }

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = (new Date(order.expiresAt).getTime() - new Date().getTime())
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)
        return () => {
            clearInterval(timerId)
        }
    }, [])
    

    const expired = timeLeft <= 0
    const expiration = !expired
        ? `You have ${timeLeft.toLocaleString()} seconds`
        : 'Order expired'

    return (
        <div>
            <h1>Purchasing {order.ticket.title}</h1>
            <h4>{expiration}</h4>
            {errors}
            {(!expired) && <StripeCheckout
                token={handlePayment}
                stripeKey='pk_test_51OwAw7AcH277dsIRZp4IGOw82eXzKadwHhhvdIN0tcuvQmEPkhfShWiRNQYA6qF95SjwfIfn6scNxonu1NlnwbeO00yvmcsTsU'
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />}
        </div>
    )
}

export type OrderShowParams = {
    order: Order
    currentUser: any
}

OrderShow.getInitialProps = async (context: CustomPageContext) => {
    const { orderId } = context.query
    if (typeof orderId !== 'string') {
        throw new Error('Order ID is invalid')
    }
    const { data } = await context.client.get(`/api/orders/${orderId}`)

    return {
        order: data,
        currentUser: context.currentUser,
    }
}

export default OrderShow
