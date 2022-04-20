import axios from "axios"
import { useState } from "react"

export type UseRequestParams = {
    url: string
    method?: 'post' | 'get' | 'put' | 'delete'
    body?: any
    onSuccess?: (data: any) => void
}

export const useRequest = ({ url, method = 'get', body, onSuccess}: UseRequestParams) => {
    const [errors, setErrors] = useState<null | JSX.Element>(null)

    const execute = async () => {
        
        try {
            setErrors(null)
            const { data } = await axios[method](url, body)
            onSuccess && onSuccess(data)
            return data
        } catch (error) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oooops...</h4>
                    <ul className="my-0">
                        {error.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
                    </ul>
                </div>
            )
        }
    }

    return { execute, errors }
}