import { Order } from "@stripe/stripe-js"
import { NextPage } from "next"
import Router from "next/router"
import { useRequest } from '../../hooks/useRequest'
import { Ticket } from "../../shared/types"
import { CustomPageContext } from "../_app"

const TicketShow: NextPage<TicketShowParams> = ({ ticket }) => {
    const { execute, errors } = useRequest<Order>({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id,
        },
        onSuccess: (order) => Router.push(`/orders/${order.id}`),
    })

    const formattedNumber = ticket.price.toLocaleString("en-US", {style:"currency", currency:"USD"});

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>{formattedNumber}</h4>
            {errors}
            <button
                onClick={() => execute()}
                className="btn btn-primary"
            >
                Purchase
            </button>
        </div>
    )
}

export type TicketShowParams = {
    ticket: Ticket
}

TicketShow.getInitialProps = async (context: CustomPageContext) => {
    const { ticketId } = context.query
    if (typeof ticketId !== 'string') {
        throw new Error('Ticket ID is invalid')
    }
    const { data } = await context.client.get(`/api/tickets/${ticketId}`)

    return {
        ticket: data,
    }
}

export default TicketShow
