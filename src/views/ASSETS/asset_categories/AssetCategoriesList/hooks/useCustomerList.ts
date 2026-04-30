import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetAssetCategories } from '@/services/CustomersService'
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

    // ✅ FIX: convert pagination properly
    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10

    const offset = (pageIndex - 1) * pageSize

    // ✅ stable SWR key (NO object spreading chaos)
    const swrKey = [
        '/api/asset_categories',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
    ]

    // ✅ proper API params
    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        () =>
            apiGetAssetCategories<GetCustomersListResponse, TableQueries>({
                limit: pageSize,
                offset: offset,
                search: tableData.query || '',
                ...filterData,
            }),
        {
            revalidateOnFocus: false,
            keepPreviousData: true, // 🔥 IMPORTANT for pagination UX
        }
    )

    // ✅ normalize data safely
    const customerList =
        data?.results?.map((customer: any, index: number) => ({
            id: customer.id ?? index,
            name: customer.name,
            code: customer.code,
            title: customer.title,
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
        mutate,
    }
}