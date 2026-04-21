import ApiService from './ApiService'

export type TenantModule = {
    id: number
    module_code: string
    module_name: string
    is_enabled: boolean
}

export const apiGetTenantModules = async (): Promise<TenantModule[]> => {
    const res = await ApiService.fetchDataWithAxios<TenantModule[]>({
        url: '/module-management/tenant-modules/',
        method: 'get',
    })

    // ApiService.fetchDataWithAxios already resolves with response.data
    // so `res` is the payload (TenantModule[]). Return it and log for debugging.
    // console.debug('[ModuleService] apiGetTenantModules called, response:', res)

    return res
}
