import { NextPage } from "next"
import Link from "next/link"
import { Order } from "../../shared/types"
import { CustomPageContext } from "../_app"

export const Orders: NextPage<OrdersParams> = ({ orders }) => {
    return (
        <div>
            {orders.map(order => {
            return (
                <li key={order.id}>
                    {order.ticket.title} - {order.status}
                </li>
            )})}
        </div>
    )
}

interface OrdersParams {
    orders: Order[]
}

Orders.getInitialProps = async (context: CustomPageContext) => {
    const { data } = await context.client.get('/api/orders')
    return {
        orders: data,
    }
}

export default Orders
