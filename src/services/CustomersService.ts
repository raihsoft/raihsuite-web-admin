import { types } from 'util'
import ApiService from './ApiService'
import axios from 'axios'
// Get employee list
export async function apiGetEmployeeList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/hrms/employees/',
        method: 'get',
        params,
    })
}

// Create new employee
export async function apiCreateEmployee<T, U extends Record<string, unknown>>(
    data: U,
) {
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

// Update employee by UUID
export async function apiUpdateEmployee<T, U extends Record<string, unknown>>(
    id: string,
    data: U,
) {
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

// customers

export async function apiGetCustomersList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/customers/',
        method: 'get',
        params,
    })
}

// orders

export async function apiGetOrderList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/orders/',
        method: 'get',
        params,
    })
}

export async function apiCreateOrders<T, U extends Record<string, unknown>>(
    data: U,
) {
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

export async function apiUpdateOrder<T, U extends Record<string, unknown>>(
    id: string,
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/order/orders/${id}/`,
        method: 'patch',
        data,
    })
}

// zone

export async function apiGetZones<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/zones/',
        method: 'get',
        params,
    })
}

export async function apiCreateZone<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/zones/',
        method: 'post',
        data,
    })
}

export async function apiUpdateZone<T, U extends Record<string, unknown>>(
    id: string,
    data: U,
) {
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

export async function apiGetOrganizations<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/organizations/',
        method: 'get',
        params,
    })
}

export async function apiCreateOrganizations<
    T,
    U extends Record<string, unknown>,
>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/order/organizations/',
        method: 'post',
        data,
    })
}

// crm

export async function apiGetEnquiries<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/crm/enquiries/',
        method: 'get',
        params,
    })
}

// Get single enquiry by id
export async function apiGetEnquiryById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/crm/enquiries/${id}/`,
        method: 'get',
    })
}
// Delete single enquiry by id
export async function apiDeleteEnquiry(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/crm/enquiries/${id}/`,
        method: 'delete',
    })
}

// Optional: bulk delete if your backend supports it
export async function apiDeleteEnquiries(ids: string[]) {
    return ApiService.fetchDataWithAxios({
        url: `/crm/enquiries/bulk-delete/`,
        method: 'post',
        data: { ids },
    })
}

// customer activity log
export async function apiGetCustomerLog<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/customers/log/',
        method: 'get',
        params,
    })
}

// get customers (list / query)
export async function apiGetCustomer<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/customers/',
        method: 'get',
        params,
    })
}

// asset


export async function apiGetAssets<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/assets/',
        method: 'get',
        params,
    })
}

export async function apiCreateAssets<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/assets/',
        method: 'post',
        data,
    })
}

// Get single asset by id
export async function apiGetAssetById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/assets/${id}/`,
        method: 'get',
    })
}

// Update single asset by id
export async function apiUpdateAsset<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/assets/${id}/`,
        method: 'patch',
        data,
    })
}

// Delete single asset by id
export async function apiDeleteAsset(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/asset/assets/${id}/`,
        method: 'delete',
    })
}

// asset-types

export async function apiAssetType<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_types/',
        method: 'get',
        params,
    })
}

export async function apiCreateAssetType<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_types/',
        method: 'post',
        data,
    })
}
export async function apiEditAssetType<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_types/',
        method: 'get',
        params,
    })
}

// Update asset type by id
export async function apiUpdateAssetType<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_types/${id}/`,
        method: 'patch',
        data,
    })
}

// Delete asset type by id
export async function apiDeleteAssetType(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/asset/asset_types/${id}/`,
        method: 'delete',
    })
}

// Get single asset type by id
export async function apiGetAssetTypeById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_types/${id}/`,
        method: 'get',
    })
}

// asset_categories

export async function apiGetAssetCategories<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_categories/',
        method: 'get',
        params,
    })
}

export async function apiCreateAssetCategories<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_categories/',
        method: 'post',
        data,
    })
}

// Get single asset category by id
export async function apiGetAssetCategoryById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_categories/${id}/`,
        method: 'get',
    })
}

// Update asset category by id
export async function apiUpdateAssetCategory<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_categories/${id}/`,
        method: 'patch',
        data,
    })
}

// Delete asset category by id
export async function apiDeleteAssetCategory(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/asset/asset_categories/${id}/`,
        method: 'delete',
    })
}



// ✅ Asset 


export async function apiGetAssetType<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_types/',
        method: 'get',
        params,
    })
}




//asset-type-category

/**
 * Get list of asset type categories
 */
export async function apiGetAssetTypeCategory<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_type_categories/',
        method: 'get',
        params, 
    })
}

/**
 * Get tenant memberships for the current user
 * Endpoint: /tenants/tenant_memberships/
 */
export async function apiGetTenantMemberships<T, U extends Record<string, unknown>>(params?: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/tenants/tenant_memberships/',
        method: 'get',
        params,
    })
} 

/**
 * Create a new asset type category
 * Backend expects JSON body with { name, description, tenant }
 */
export async function apiCreateAssetTypeCategory<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_type_categories/',
        method: 'post',
        data, // ✅ send as JSON body
    })
}

/**
 * Edit asset type category (full update)
 * Use PUT if backend expects full replacement
 */
export async function apiEditAssetTypeCategory<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'put', 
        data,
    })
}

/**
 * Update asset type category by id (partial update)
 */
export async function apiUpdateAssetTypeCategory<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'patch',
        data,
    })
}

/**
 * Delete asset type category by id
 */
export async function apiDeleteAssetTypeCategory(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'delete',
    })
}

/**
 * Get single asset type category by id
 */
export async function apiGetAssetTypeCategoryById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'get',
    })
}




export const apiDeleteEnquiryById = async (id: string) => {
  return axios.delete(`/api/enquiries/${id}`)
}



// Events

export async function apiGetEventsList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/participants/',
        method: 'get',
        params,
    })
}

// Create participant
export async function apiCreateParticipant<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/participants/',
        method: 'post',
        data,
    })
}

// Update participant by id
export async function apiUpdateParticipant<T, U extends Record<string, unknown>>(
    id: string,
    data: U
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/participants/${id}/`,
        method: 'patch',
        data,
    })
}

export async function apiGetParticipant<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/participants/${id}/`, 
        method: 'get',
    })
}
// Delete participant by id
export async function apiDeleteParticipant(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/events/participants/${id}/`,
        method: 'delete',
    })
}

// Get events list
export async function apiGetEvents<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/events/',
        method: 'get',
        params,
    })
}

export async function apiGetEvent<T>(code: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/events/${code}/`,
        method: 'get',
    })
}


// Create event
export async function apiCreateEvent<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/events/',
        method: 'post',
        data,
    })
}

// Update event
// Update event by code
export async function apiUpdateEvent<T, U extends Record<string, unknown>>(
    code: string,
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/events/${code}/`, 
        method: 'patch',
        data,
    })
}


// Delete event
export async function apiDeleteEvent(code: string) {
    return ApiService.fetchDataWithAxios({
        url: `/events/events/${code}/`,   
        method: 'delete',
    })
}



// import ApiService from './ApiService'

// services/CustomersService.ts
export async function apiGetTenantById<T, U = Record<string, unknown>>(id: number) {
    return ApiService.fetchDataWithAxios<T, U>({
        url: `/tenants/tenants/${id}/`,
        method: 'get',
    })
}



// session management

export async function apiGetSessionList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/sessions/',
        method: 'get',
        params,
    })
}


export async function apiCreateSession<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/sessions/',
        method: 'post',
        data,
    })
}


export async function apiUpdateSession<T, U extends Record<string, unknown>>(
    id: string,
    data: U
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/sessions/${id}/`,
        method: 'patch',
        data,
    })
}

// session-attendance


export async function apiGetSessionAttendanceList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/session-attendance/',
        method: 'get',
        params,
    })
}

export async function apiCreateSessionAttendance<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/events/session-attendance/',
        method: 'post',
        data,
    })
}




export async function apiUpdateSessionAttendance<T, U extends Record<string, unknown>>(
    id: string,
    data: U
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/session-attendance/${id}/`,
        method: 'patch',
        data,
    })
}
export async function apiUpdateSessionAttendanceDetails<T, U extends Record<string, unknown>>(
    id: string,
    data: U
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/events/session-attendance/${id}/`,
        method: 'patch',
        data,
    })
}
