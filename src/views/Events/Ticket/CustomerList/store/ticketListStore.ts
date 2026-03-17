import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Ticket, TicketFilter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
}

export const initialFilterData: TicketFilter = {
    status: [],
    event_id: '',
}

export type TicketListState = {
    tableData: TableQueries
    filterData: TicketFilter
    selectedTicket: Partial<Ticket>[]
}

type TicketListAction = {
    setFilterData: (payload: TicketFilter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedTicket: (checked: boolean, ticket: Ticket) => void
    setSelectAllTicket: (ticket: Ticket[]) => void
}

export const useTicketListStore = create<TicketListState & TicketListAction>(
    (set) => ({
        tableData: initialTableData,
        filterData: initialFilterData,
        selectedTicket: [],
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedTicket: (checked, row) =>
            set((state) => {
                const { selectedTicket } = state
                if (checked) {
                    return {
                        selectedTicket: [...selectedTicket, row],
                    }
                } else {
                    return {
                        selectedTicket: selectedTicket.filter(
                            (item) => item.id !== row.id
                        ),
                    }
                }
            }),
        setSelectAllTicket: (row) => set(() => ({ selectedTicket: row })),
    })
)
