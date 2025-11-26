import { types } from 'util'
import ApiService from './ApiService'

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
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_types/',
        method: 'post',
        params,
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



// ✅ Asset Type
export async function apiGetAssetType<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_types/',
        method: 'get',
        params,
    })
}




//asset-type-category
export async function  apiGetAssetTypeCategory<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_type_categories/',
        method: 'get',
        params,
    })
}
export async function  apiCreateAssetTypeCategory<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_type_categories/',
        method: 'post',
        params,
    })
}
export async function  apiEditAssetTypeCategory<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/asset/asset_type_categories/',
        method: 'edit',
        params,
    })
}

// Update asset type category by id
export async function apiUpdateAssetTypeCategory<T, U extends Record<string, unknown>>(id: string, data: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'patch',
        data,
    })
}

// Delete asset type category by id
export async function apiDeleteAssetTypeCategory(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'delete',
    })
}

// Get single asset type category by id
export async function apiGetAssetTypeCategoryById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/asset/asset_type_categories/${id}/`,
        method: 'get',
    })
}


