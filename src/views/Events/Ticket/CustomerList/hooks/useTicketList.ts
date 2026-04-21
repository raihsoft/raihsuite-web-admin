import { apiGetTicketList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useTicketListStore } from '../store/ticketListStore'
import type { GetTicketsListResponse, Ticket } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useTicketList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedTicket,
        setSelectedTicket,
        setSelectAllTicket,
        setFilterData,
    } = useTicketListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/events/tickets', { ...tableData, ...filterData }],
        ([_, params]) =>
            apiGetTicketList<GetTicketsListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Normalize API response shape
    const rawList: Ticket[] = (data?.list ?? data?.results ?? []) as Ticket[]

    const ticketList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? `tmp-${index}`,
            participant_name: item.participant_name ?? '',
            token: item.token ?? '',
            status: item.status ?? '',
            event_id: item.event_id ?? '',
            event_title: item.event_title ?? '',
            created_at: item.created_at ?? '',
            updated_at: item.updated_at ?? '',
        }),
    )

    const ticketListTotal =
        data?.total ??
        (Array.isArray(rawList) ? rawList.length : 0)

    return {
        ticketList,
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
    }
}
