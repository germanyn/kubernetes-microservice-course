import axios, { AxiosInstance } from 'axios'
import { NextPageContext } from 'next'
import { isServerRender } from '../shared/nextUtils'

export const buildRequestClient = (context?: NextPageContext): AxiosInstance => {
    const baseURL = isServerRender
        ? 'http://proxy-srv'
        : '/'
    return axios.create({
        baseURL,
        headers: context?.req?.headers as Record<string, string>,
    })
}