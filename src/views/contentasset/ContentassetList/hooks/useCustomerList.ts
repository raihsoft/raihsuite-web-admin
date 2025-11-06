
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetContent } from '@/services/CustomersService'
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

    const { data, error, isLoading } = useSWR(
        ['/api/contents', { ...tableData, ...filterData }] as const,
        ([, params]) => apiGetContent<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

const customerList = data?.map((customer: any, index: number) => ({
    id: customer.id ?? index,
    category: customer.category,
    title: customer.title,
    file: customer.file,
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
    }
}