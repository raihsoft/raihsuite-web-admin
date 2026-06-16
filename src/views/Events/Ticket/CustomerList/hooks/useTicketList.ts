import { apiGetTicketList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useTicketListStore } from '../store/ticketListStore'
import type { GetTicketsListResponse, Ticket } from '../types'

export default function useTicketList(eventId?: string) {
    const {
        tableData,
        filterData,
        setTableData,
        selectedTicket,
        setSelectedTicket,
        setSelectAllTicket,
        setFilterData,
    } = useTicketListStore((state) => state)

    // =========================
    // Pagination FIX
    // =========================
    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10
    const offset = (pageIndex - 1) * pageSize

    // =========================
    // Stable SWR key
    // =========================
    const swrKey = [
        '/api/events/tickets',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
        eventId ?? '',
    ]

    // =========================
    // Fetcher
    // =========================
    const fetcher = () =>
        apiGetTicketList<GetTicketsListResponse, any>({
            limit: eventId ? 1000 : pageSize,
            offset: eventId ? 0 : offset,
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
        }
    )

    // =========================
    // Normalize data
    // =========================
    const rawList: Ticket[] = (data?.list ?? data?.results ?? []) as Ticket[]

    const ticketList = (Array.isArray(rawList) ? rawList : []).map(
        (item: any, index) => ({
            id: item.id ?? `tmp-${index}`,

            participant_name: item.participant_name ?? '',
            token: item.token ?? '',
            status: item.status ?? '',
            event_id: item.event_id ?? item.event ?? '',
            event_title: item.event_title ?? '',
            created_at: item.created_at ?? '',
            updated_at: item.updated_at ?? '',
        })
    )

    const filteredList = eventId
        ? ticketList.filter((t) => String(t.event_id) === String(eventId))
        : ticketList

    const ticketListTotal = eventId ? filteredList.length : (data?.count ?? data?.total ?? 0)

    const paginatedList = eventId
        ? filteredList.slice(offset, offset + pageSize)
        : ticketList

    // =========================
    // SAFE selection reset
    // =========================
    const clearSelection = () => {
        setSelectedTicket([])
        setSelectAllTicket([])
    }

    return {
        ticketList: paginatedList,
        ticketListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedTicket,
        setSelectedTicket,
        setSelectAllTicket,
        setFilterData,
        clearSelection,
    }
}