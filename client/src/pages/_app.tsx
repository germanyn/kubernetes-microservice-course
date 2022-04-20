import 'bootstrap/dist/css/bootstrap.css'
import { AppContext, AppProps } from 'next/app'
import { buildRequestClient } from '../api/buildRequestClient'
import Header from '../components/Header'

export type LandingParams = {
    currentUser: any
}

const MyAppComponent = ({ Component, pageProps, currentUser }: AppProps & LandingParams) => {

    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    )
}


MyAppComponent.getInitialProps = async (appContext: AppContext) => {
    const client = buildRequestClient(appContext.ctx)
    const { data } = await client.get('/api/users/current-user')
    const pageProps = await appContext.Component?.getInitialProps?.(appContext.ctx)

    return {
        pageProps,
        currentUser: data.currentUser,
    }
}

export default MyAppComponent