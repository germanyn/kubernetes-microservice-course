import { NextPage } from "next"
import { CustomPageContext } from "./_app"

// @ts-ignore
export const Landing: NextPage<LandingParams> = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
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

interface Ticket {
    id: string
    price: number
    title: string
    userId: string
    version: number
}

// @ts-ignore
Landing.getInitialProps = async (context: CustomPageContext) => {
    const { data } = await context.client.get('/api/tickets')
    return {
        tickets: data,
        currentUser: context.currentUser,
    }
}

export default Landing
