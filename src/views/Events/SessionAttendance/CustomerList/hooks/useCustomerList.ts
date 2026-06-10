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

    // ✅ FIX: convert pagination
    const limit = tableData.pageSize
    const offset = (tableData.pageIndex - 1) * tableData.pageSize

    const params = {
        limit,
        offset,
        ordering: '-created_at', // optional but recommended
        ...filterData,
        ...(eventId ? { event_id: eventId } : {}),
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
        }))
    }, [rawList])

    // ✅ correct total
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