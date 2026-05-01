import appConfig from '@/configs/app.config'
import {
    TOKEN_TYPE,
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_NAME_IN_STORAGE,
} from '@/constants/api.constant'
import type { InternalAxiosRequestConfig } from 'axios'

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    const storage = appConfig.accessTokenPersistStrategy

    let accessToken = ''

    // 🔹 Get token from the same storage key used by authStore
    if (storage === 'localStorage') {
        accessToken = localStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''

    } else if (storage === 'sessionStorage') {
        accessToken = sessionStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
    }

    // ⭐ Add Bearer token to request
    if (accessToken) {
        config.headers[REQUEST_HEADER_AUTH_KEY] =
            `${TOKEN_TYPE} ${accessToken}`
    }

    return config
}

export default AxiosRequestIntrceptorConfigCallback
