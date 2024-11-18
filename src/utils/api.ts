//src/utils/api.ts
export const TRANSACTION_API_URL = process.env.NEXT_PUBLIC_TRANSACTION_API_URL;
export const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
export const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL;

export const getTransactionUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Transaction/${userId}/${rolId}`

export const getNodeInfoUrl = () =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Transaction/node-info`

export const getUserCreateUrl = () =>
    `${USER_API_URL}/ssptbpetdlt/user/api/v1/User/create`

export const getUserProfileUrl = (userId: string) =>
    `${USER_API_URL}/ssptbpetdlt/user/api/v1/User/${userId}`

export const updateUserProfileUrl = (userId: string) =>
    `${USER_API_URL}/ssptbpetdlt/user/api/v1/User/${userId}`

export const getLoginUrl = () =>
    `${AUTH_API_URL}/ssptbpetdlt/auth/api/v1/Login/login`

export const getTotalTransactionsUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Metrics/total-transactions/${userId}/${rolId}`

export const getSuccessErrorRatioUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Metrics/success-error-ratio/${userId}/${rolId}`

export const getMonthlyComparisonUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Metrics/monthly-comparison/${userId}/${rolId}`

export const getTransactionsPerHourUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Metrics/transactions-per-hour/${userId}/${rolId}`

export const getTransactionTrendUrl = (userId: string, rolId: string) =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Metrics/transaction-trend/${userId}/${rolId}`

export const getUsersUrl = () =>
    `${USER_API_URL}/ssptbpetdlt/user/api/v1/User/GetUsers`

export const getSecurityAuditUrl = () =>
    `${TRANSACTION_API_URL}/ssptbpetdlt/transaction/api/v1/Audit/full-audit`