import ApiService from './ApiService'

export async function apiGetZones<T>(params?: {
    offset?: number
    limit?: number
    ordering?: string
    search?: string
}) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/zones/',
        method: 'get',
        params,
    })
}
