import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetAssets } from '@/services/CustomersService'
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

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/assets', { ...tableData, ...filterData }] as const,
        ([, params]) =>
            apiGetAssets<GetCustomersListResponse, TableQueries>(
                transformPaginationParams(params)
            ),
        { revalidateOnFocus: false }
    )

    const customerList =
        data?.results?.map((customer: any, index: number) => ({
            id: customer.id ?? index,
            title: customer.title,
            file: customer.file,
            file_extension: customer.file_extension,
            asset_type_ref: customer.asset_type_ref,
            asset_category: customer.asset_category,
            tags: customer.tags,
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
        mutate, // <-- expose mutate here
    }
}
