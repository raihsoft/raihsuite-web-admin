import { useMemo } from 'react'
import { apiGetEvents } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '@/views/Events/Events/CustomerList/store/customerListStore'
import type { TableQueries } from '@/@types/common'

export type EventItem = {
    id: string
    title: string
    code?: string
    start_date?: string
    end_date?: string
    fee_amount?: string | number
}

export default function useEventsList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    // ✅ FIX: convert pagination
    const limit = tableData.pageSize
    const offset = (tableData.pageIndex - 1) * tableData.pageSize

    const swrKey = [
        '/api/events/events',
        {
            limit,
            offset,
            ordering: '-created_at',
            ...(tableData.query ? { search: tableData.query } : {}),
            ...filterData,
        },
    ] as const

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, params]) => apiGetEvents<any, any>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // ✅ normalize response
    const rawList: any[] = Array.isArray(data?.results)
        ? data.results
        : []

    const eventsList: EventItem[] = useMemo(() => {
        return rawList.map((item: any, index: number) => ({
            id: item.id ?? `tmp-${index}`,
            title: item.title || '',
            code: item.code || '',
            fee_amount: item.fee_amount,
            start_date: item.start_date || '',
            end_date: item.end_date || '',
        }))
    }, [rawList])

    // ✅ correct total
    const eventsTotal = data?.count ?? 0

    return {
        eventsList,
        eventsTotal,
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