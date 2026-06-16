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

    const limit = tableData.pageSize
    const offset = (tableData.pageIndex - 1) * tableData.pageSize

    const params = {
        limit: eventId ? 1000 : limit,
        offset: eventId ? 0 : offset,
        ordering: '-created_at', // optional but recommended
        ...filterData,
        ...(eventId ? { event_id: eventId, event: eventId, session__event: eventId } : {}),
    }

    const swrKey = [
        '/api/events/session-attendance',
        params,
        eventId ?? null,
    ] as const

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, params]) =>
            apiGetSessionAttendanceList<any, any>(params),
        {
            revalidateOnFocus: false,
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
        return eventId
            ? customerList.filter((p) => String(p.event) === String(eventId))
            : customerList
    }, [customerList, eventId])

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