import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetAssetsType } from '@/services/CustomersService'
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
        ['/api/asset_types', { ...tableData, ...filterData }] as const,
        ([, params]) => apiGetAssetsType<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

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
    }
}
