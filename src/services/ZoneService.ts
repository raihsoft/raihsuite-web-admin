import ApiService from './ApiService'

export async function apiGetZones<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/zones/',
        method: 'get',
    })
}
