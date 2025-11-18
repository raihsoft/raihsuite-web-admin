
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import {  apiGetOrganizations } from '@/services/CustomersService'
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
        ([, params]) => apiGetOrganizations<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

const customerList = data?.results?. map((customer: any, index: number) => ({
    id: customer.id ?? index,
    category: customer.category,
    title: customer.title,
    slug: customer.slug,
    body: customer.body,

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