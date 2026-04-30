import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { TicketFilter } from '../types'

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
    selectedTicket: string[]   // 🔥 FIXED
}

type TicketListAction = {
    setFilterData: (payload: TicketFilter) => void
    setTableData: (payload: TableQueries) => void

    setSelectedTicket: (ids: string[]) => void   // 🔥 FIXED

    setSelectAllTicket: (ids: string[]) => void  // 🔥 FIXED
}

export const useTicketListStore = create<TicketListState & TicketListAction>(
    (set) => ({
        tableData: initialTableData,
        filterData: initialFilterData,
        selectedTicket: [],

        setFilterData: (payload) =>
            set(() => ({ filterData: payload })),

        setTableData: (payload) =>
            set(() => ({ tableData: payload })),

        // 🔥 SINGLE SOURCE OF TRUTH (IDS ONLY)
        setSelectedTicket: (ids) =>
            set(() => ({ selectedTicket: ids })),

        setSelectAllTicket: (ids) =>
            set(() => ({ selectedTicket: ids })),
    })
)