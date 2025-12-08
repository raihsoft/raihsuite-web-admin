import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetAssetTypeCategory } from '@/services/CustomersService'
import { transformPaginationParams } from '@/utils/transformPaginationParams'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'

export default function useCustomerList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/asset_type_categories', { ...tableData, ...filterData }] as const,
        ([, params]) =>
            apiGetAssetTypeCategory<GetCustomersListResponse, TableQueries>(
                transformPaginationParams(params)
            ),
        { revalidateOnFocus: false }
    )

    // ✅ Always use the backend ID, never fallback to index
    const customerList =
        data?.results?.map((customer: any) => ({
            id: customer.id,              // must be the real backend ID
            name: customer.name,
            description: customer.description,
            status: 'active',
            totalSpending: 0,
        })) ?? []

    const customerListTotal = data?.count ?? 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
        mutate, // ✅ expose SWR mutate
    }
}
