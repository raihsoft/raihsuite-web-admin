import { apiGetSessionList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

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

    // ✅ FIX: proper pagination
    const limit = tableData.pageSize
    const offset = (tableData.pageIndex - 1) * tableData.pageSize

    const { data, error, isLoading, mutate } = useSWR(
        [
            '/api/events/sessions',
            {
                limit,
                offset,
                ordering: '-created_at',
                ...filterData,
            },
        ],
        ([_, params]) =>
            apiGetSessionList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // ✅ normalize response
    const rawList: any[] = data?.results ?? []

    const customerList = rawList.map((item: any, index: number) => ({
        id: item.id ?? `tmp-${index}`,
        title: item.title ?? '',
        start_datetime: item.start_datetime ?? '',
        end_datetime: item.end_datetime ?? '',
        day: item.day ?? '',
        speaker: item.speaker ?? '',
        location: item.location ?? '',
        event_title: item.event_title ?? '',
    }))

    const customerListTotal = data?.count ?? 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}