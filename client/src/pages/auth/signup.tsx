import { DOMAttributes, useState } from "react"
import { useRequest } from "../../hooks/useRequest"
import Router from 'next/router'

export const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { execute, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password,
        },
        onSuccess: () => Router.push('/'),
    })

    const onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'] = async (event) => {
        event.preventDefault()

        await execute()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default Signup


