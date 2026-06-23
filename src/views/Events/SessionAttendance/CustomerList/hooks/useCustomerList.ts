import { useMemo } from 'react'
import { apiGetSessionAttendanceList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
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
        '/api/events/session-attendance',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
        eventId ?? '',
    ]

    const fetcher = () =>
        apiGetSessionAttendanceList<any, any>({
            limit: eventId ? 1000 : limit,
            offset: eventId ? 0 : offset,
            ordering: '-created_at', // optional but recommended
            search: tableData.query || '',
            ...(eventId ? { event_id: eventId, event: eventId, session__event: eventId } : {}),
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
    const rawList: any[] = Array.isArray(data?.results)
        ? data.results
        : []

    const customerList = useMemo(() => {
        return rawList.map((item, index) => ({
            id: item.id ?? `tmp-${index}`,
            session_title: item.session_title ?? '',
            participant_name: item.participant_name ?? '',
            referencedBy:
                item.referred_by ??
                item.referenced_by ??
                item.referencedBy ??
                '',
            event: item.event ?? item.event_id ?? item.session_event ?? '',
        }))
    }, [rawList])

    const filteredList = useMemo(() => {
        return customerList.filter((p) => {
            if (eventId && String(p.event) !== String(eventId)) return false

            const query = (tableData.query || '').toLowerCase().trim()
            if (query) {
                return (
                    (p.session_title || '').toLowerCase().includes(query) ||
                    (p.participant_name || '').toLowerCase().includes(query)
                )
            }
            return true
        })
    }, [customerList, eventId, tableData.query])

    // ✅ correct total
    const customerListTotal = eventId ? filteredList.length : (data?.count ?? 0)

    const paginatedList = useMemo(() => {
        return eventId ? filteredList.slice(offset, offset + limit) : customerList
    }, [filteredList, customerList, eventId, offset, limit])

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