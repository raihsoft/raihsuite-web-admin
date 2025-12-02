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
            page: tableData.pageIndex,       // FIXED
            pageSize: tableData.pageSize,    // FIXED
            ...filterData,
        },
    ] as const

    const { data, error, isLoading } = useSWR(
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
            phone: customer.phone,
            message: customer.message,
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
    }
}
