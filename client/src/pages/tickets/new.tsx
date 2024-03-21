import { NextPage } from "next"
import Router from 'next/router'
import { useState } from "react"
import { useRequest } from '../../hooks/useRequest'

export type NewTicketParams = {
    currentUser: any
}

const NewTicket: NextPage<NewTicketParams> = ({ currentUser }) => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const { execute, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price,
        },
        onSuccess: (ticket) => Router.push('/'),
    })

    function handlePriceBlur() {
        const parsed = parseFloat(price)
        if (Number.isNaN(parsed)) {
            return
        }

        setPrice(parsed.toFixed(2))
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        execute()
    }

    return (
        <div>
            <h1>Create a Ticket</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group mb-3">
                    <label>Price</label>
                    <input
                        value={price}
                        onBlur={handlePriceBlur}
                        onChange={e => setPrice(e.target.value)}
                        className="form-control"
                    />
                </div>

                {errors}

                <button
                   type="submit"
                   className="btn btn-primary"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default NewTicket
