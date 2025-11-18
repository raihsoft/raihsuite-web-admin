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

    // ✅ Use SWR for fetching data
    const { data, error, isLoading } = useSWR(
        ['/api/contents', { ...tableData, ...filterData }] as const,
        async ([, params]) => {
            const response = await apiGetContent<GetCustomersListResponse, TableQueries>(params)
            return response // ensure this returns parsed data
        },
        { revalidateOnFocus: false }
    )

    // ✅ Map the response correctly
    const contentList = data?.results?.map((item: any, index: number) => ({
        id: item.id ?? index,
        category: item.category,
        title: item.title,
        slug: item.slug,
        body: item.body,
        status: 'active',
        totalSpending: 0,
    })) ?? []

    const totalCount = data?.count ?? 0

    return {
        customerList: contentList,
        customerListTotal: totalCount,
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
