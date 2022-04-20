import Router from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { useRequest } from '../../hooks/useRequest'

function signout(): ReactElement {
    const { execute } = useRequest({
        url: '/api/users/signout',
        onSuccess: () => Router.push('/'),
    })

    useEffect(() => {
        execute()
    }, [])

    return (
        <h2>
            sign out...
        </h2>
    )
}

export default signout
