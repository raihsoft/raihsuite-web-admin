
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetContentCategories } from '@/services/CustomersService'
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
        ['/api/content_categories', { ...tableData, ...filterData }] as const,
        ([, params]) => apiGetContentCategories<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

const customerList = data?.map((customer: any, index: number) => ({
    id: customer.id ?? index,
    name: customer.name,
    slug: customer.slug,
    title: customer.title,
    code: customer.code,
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