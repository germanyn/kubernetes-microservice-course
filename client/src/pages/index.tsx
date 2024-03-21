import { NextPage } from "next"
import Link from "next/link"
import { Ticket } from "../shared/types"
import { CustomPageContext } from "./_app"

export const Landing: NextPage<LandingParams> = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        View
                    </Link>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <h1></h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

interface LandingParams {
    currentUser: any
    tickets: Ticket[]
}

Landing.getInitialProps = async (context: CustomPageContext) => {
    const { data } = await context.client.get('/api/tickets')
    return {
        tickets: data,
        currentUser: context.currentUser,
    }
}

export default Landing
