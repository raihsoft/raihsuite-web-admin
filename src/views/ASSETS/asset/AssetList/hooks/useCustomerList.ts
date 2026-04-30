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

    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10

    // =========================
    // FIX 1: STABLE SWR KEY
    // =========================
    const swrKey = [
        '/api/assets',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
    ]

    // =========================
    // FETCHER
    // =========================
    const fetcher = () =>
        apiGetAssets<GetCustomersListResponse, TableQueries>(
            transformPaginationParams({
                ...tableData,
                ...filterData,
            })
        )

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true, // 🔥 IMPORTANT FOR PAGINATION
        }
    )

    // =========================
    // NORMALIZE DATA
    // =========================
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
        })) ?? []

    // =========================
    // FIX: SAFE TOTAL
    // =========================
    const customerListTotal =
        data?.count ??
        data?.total ??
        (pageIndex - 1) * pageSize + customerList.length

    // =========================
    // RESET HELPERS
    // =========================
    const clearSelection = () => {
        setSelectedCustomer([])
        setSelectAllCustomer([])
    }

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
        clearSelection,
    }
}