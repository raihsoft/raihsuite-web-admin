import ApiService from './ApiService'

// ✅ Get content list
export async function apiGetContent<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/contents/',
        method: 'get',
        params,
    })
}

// ✅ Get contents (content module)
export async function apiGetContents<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/content/contents/',
        method: 'get',
        params,
    })
}

export async function apiGetContentById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/content/contents/${id}/`,
        method: 'get',
    })
}

export async function apiCreateContent<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/content/contents/',
        method: 'post',
        data,
    })
}

export async function apiUpdateContent<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/content/contents/${id}/`,
        method: 'patch',
        data,
    })
}

// ✅ Employee management
export async function apiGetEmployees<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrms/employees/',
        method: 'get',
        params,
    })
}

export async function apiCreateEmployee<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrms/employees/',
        method: 'post',
        data,
    })
}

export async function apiGetEmployeeById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/hrms/employees/${id}/`,
        method: 'get',
    })
}

export async function apiUpdateEmployee<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/hrms/employees/${id}/`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteEmployee(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/hrms/employees/${id}/`,
        method: 'delete',
    })
}

// ✅ Orders
export async function apiGetOrderList<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/orders/',
        method: 'get',
        params,
    })
}

export async function apiCreateOrders<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/orders/',
        method: 'post',
        data,
    })
}

export async function apiGetOrderById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/order/orders/${id}/`,
        method: 'get',
    })
}

export async function apiUpdateOrder<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/order/orders/${id}/`,
        method: 'patch',
        data,
    })
}

// ✅ Zones
export async function apiGetZones<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/zones/',
        method: 'get',
        params,
    })
}

export async function apiCreateZone<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/zones/',
        method: 'post',
        data,
    })
}

export async function apiUpdateZone<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/order/zones/${id}/`,
        method: 'patch',
        data,
    })
}

export async function apiGetZoneById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/order/zones/${id}/`,
        method: 'get',
    })
}

// ✅ Organizations
export async function apiGetOrganizations<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/organizations/',
        method: 'get',
        params,
    })
}

export async function apiCreateOrganizations<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/organizations/',
        method: 'post',
        data,
    })
}

// ✅ CRM
export async function apiGetEnquiries<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crm/enquiries/',
        method: 'get',
        params,
    })
}

// ✅ Content Categories placeholder
export const apiGetContentCategories = () => {
    // your API call here
}


export async function apiGetAssetsType<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset_types/',
        method: 'get',
        params,
    })
}
export async function apiGetAssets<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/assets/',
        method: 'get',
        params,
    })
}

export async function apiGetAssetCategory<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset_categories/',
        method: 'get',
        params,
    })
}
// ✅ Asset Type Categories
export async function apiGetAssetTypeCategory<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset_type_categories/',
        method: 'get',
        params,
    })
}

// ✅ Customers List (for Delivery module)
export async function apiGetCustomersList<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/customers/',
        method: 'get',
        params,
    })
}
