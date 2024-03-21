import { AxiosInstance } from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { NextComponentType } from 'next'
import { AppContext, AppProps } from 'next/app'
import { buildRequestClient } from '../api/buildRequestClient'
import Header from '../components/Header'

export type MyAppParams = {
    currentUser: any
    client: AxiosInstance
}

const MyAppComponent = ({ Component, pageProps, client, currentUser }: AppProps & MyAppParams) => {

    return (
        <div>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} client={client} {...pageProps} />
            </div>
        </div>
    )
}

export type CustomAppContext = AppContext & {
    ctx: CustomPageContext
}

export type CustomPageContext = AppContext['ctx'] & {
    client: AxiosInstance
    currentUser: any
}

MyAppComponent.getInitialProps = async (appContext: CustomAppContext) => {
    const client = buildRequestClient(appContext.ctx)
    const { data } = await client.get('/api/users/current-user')

    appContext.ctx.client = client
    appContext.ctx.currentUser = data.currentUser

    let pageProps = undefined
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }

    return {
        pageProps,
        client,
        currentUser: data.currentUser,
    }
}

export default MyAppComponent