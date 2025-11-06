import ApiService from './ApiService'

// Get employee list
export async function apiGetEmployees<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrms/employees/',
        method: 'get',
        params,
    })
}

// Create new employee
export async function apiCreateEmployee<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrms/employees/',
        method: 'post',
        data,
    })
}

// Get single employee by UUID
export async function apiGetEmployeeById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/hrms/employees/${id}/`,
        method: 'get',
    })
}

// Update employee by UUID
export async function apiUpdateEmployee<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/hrms/employees/${id}/`,
        method: 'patch',
        data,
    })
}

// Delete employee by UUID
export async function apiDeleteEmployee(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/hrms/employees/${id}/`,
        method: 'delete',
    })
}



// orders

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



// zone

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

// organization

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


// crm


export async function apiGetEnquiries<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crm/enquiries/',
        method: 'get',
        params,
    })
}
