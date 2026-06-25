import { apiGetSessionList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useCustomerList(eventId?: string) {
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
    const limit = pageSize
    const offset = (pageIndex - 1) * limit

    const swrKey = [
        '/api/events/sessions',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
        eventId ?? '',
    ]

    const fetcher = () =>
        apiGetSessionList<GetCustomersListResponse, any>({
            limit: eventId ? 1000 : limit,
            offset: eventId ? 0 : offset,
            ordering: '-created_at',
            search: tableData.query || '',
            ...(eventId ? { event_id: eventId, event: eventId } : {}),
            ...filterData,
        })

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
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
        event: item.event ?? '',
    }))

    const filteredList = eventId
        ? customerList.filter((p) => String(p.event) === String(eventId))
        : customerList

    const customerListTotal = eventId ? filteredList.length : (data?.count ?? 0)

    const paginatedList = eventId
        ? filteredList.slice(offset, offset + limit)
        : customerList

    return {
        customerList: paginatedList,
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