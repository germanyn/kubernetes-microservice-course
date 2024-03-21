import { NextPage } from "next"

export type LandingParams = {
    currentUser: any
}

export const Landing: NextPage<LandingParams> = ({ currentUser }) => {
    return <h1>Ticket ID</h1>
}

export default Landing
