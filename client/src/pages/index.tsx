import axios from "axios"
import { NextPage } from "next"
import { buildRequestClient } from "../api/buildRequestClient"

export type LandingParams = {
    currentUser: any
}

export const Landing: NextPage<LandingParams> = ({ currentUser }) => {
    return currentUser
        ? <h1>You're signed in</h1>
        : <h1>You're NOT signed in</h1>
}

Landing.getInitialProps = async (context) => {
    const client = buildRequestClient(context)
    const { data } = await client.get('/api/users/current-user')
    return data
}

export default Landing
