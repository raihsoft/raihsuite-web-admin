import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetAssetType } from '@/services/CustomersService'
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

    // SWR fetcher
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/asset_types', { ...tableData, ...filterData }] as const,
        ([, params]) =>
            apiGetAssetType<GetCustomersListResponse, TableQueries>(
                transformPaginationParams(params)
            ),
        { revalidateOnFocus: false }
    )

    // Transform backend response into customer list
    const customerList =
        data?.results?.map((customer: any, index: number) => ({
            id: customer.id ?? index,
            name: customer.name,
            code: customer.code,
            file_extension: customer.file_extension,
            asset_category: customer.asset_category,
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
        mutate, // ✅ expose mutate so components can call it
    }
}
