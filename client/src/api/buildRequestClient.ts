import axios, { AxiosInstance } from 'axios'
import { NextPageContext } from 'next'
import { isServerRender } from '../shared/nextUtils'

export const buildRequestClient = (context?: NextPageContext): AxiosInstance => {
    const webUrl = process.env.NODE_ENV !== 'production' ? 'http://proxy-srv' : 'http://174.138.117.163.nip.io'
    const baseURL = isServerRender
        ? webUrl
        : '/'
    return axios.create({
        baseURL,
        headers: context?.req?.headers as Record<string, string>,
    })
}