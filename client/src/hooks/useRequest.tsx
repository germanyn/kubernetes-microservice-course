import axios from "axios"
import { useState } from "react"

export type UseRequestParams<ReturnType, ParamsType> = {
    url: string
    method?: 'post' | 'get' | 'put' | 'delete'
    body?: ParamsType
    onSuccess?: (data: ReturnType) => void
}

export const useRequest = <ReturnType = unknown, ParamsType = object>({ url, method = 'get', body, onSuccess}: UseRequestParams<ReturnType, ParamsType>) => {
    const [errors, setErrors] = useState<null | JSX.Element>(null)

    const execute = async (props?: ParamsType) => {
        
        try {
            setErrors(null)
            const { data } = await axios[method](url, {
                ...body,
                ...props,
            })
            onSuccess && onSuccess(data as ReturnType)
            return data
        } catch (error) {
            console.log(error)
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