import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const TRANSACTION_API_URL = publicRuntimeConfig.transactionApiUrl
export const AUTH_API_URL = publicRuntimeConfig.authApiUrl
export const USER_API_URL = publicRuntimeConfig.userApiUrl

export const getTransactionUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Transaction/${userId}/${rolId}`

export const getNodeInfoUrl = () =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Transaction/node-info`

export const getUserCreateUrl = () =>
    `${USER_API_URL}/ssptbpetdlt/user/api/v1/User/create`

export const getLoginUrl = () =>
    `${AUTH_API_URL}/ssptbpetdlt/auth/api/v1/Login/login`