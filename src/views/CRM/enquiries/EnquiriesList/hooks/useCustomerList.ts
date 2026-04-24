import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'
import { apiGetEnquiries } from '@/services/CustomersService'

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

    // IMPORTANT — Use pageIndex instead of page  
    const swrKey = [
        '/api/enquiries',
        {
            page: tableData.pageIndex,
            pageSize: tableData.pageSize,
            ...filterData,
        },
    ] as const

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([, params]) =>
            apiGetEnquiries<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

    const customerList =
        data?.results?.map((customer: any, index: number) => ({
            id: customer.id ?? index,
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            created_at: customer.created_at,
            message: customer.message,
            status: 'active',
            totalSpending: 0,
        })) ?? []

    // Handle multiple possible field names for total count from backend
    const customerListTotal = data?.count ?? data?.total ?? data?.total_count ?? 0

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
        mutate, // <-- added
    }
}
