import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetAssetType } from '@/services/CustomersService'
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

    const pageIndex = tableData.pageIndex || 1
    const pageSize = tableData.pageSize || 10

    // 🔥 IMPORTANT FIX
    const offset = (pageIndex - 1) * pageSize

    const { data, error, isLoading, mutate } = useSWR(
        ['asset-types', pageIndex, pageSize, tableData.query, filterData],
        () =>
            apiGetAssetType<GetCustomersListResponse>({
                limit: pageSize,
                offset: offset,   // ✅ THIS IS THE FIX
                search: tableData.query || '',
                ...filterData,
            }),
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        }
    )

    const customerList =
        data?.results?.map((item: any, index: number) => ({
            id: item.id ?? index,
            name: item.name,
            code: item.code,
            file_extension: item.file_extension,
            asset_category: item.asset_category,
            description: item.description,
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
        mutate,
    }
}