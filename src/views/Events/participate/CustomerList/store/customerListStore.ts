import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Customer, Filter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    purchasedProducts: '',
    purchaseChannel: [
        'Retail Stores',
        'Online Retailers',
        'Resellers',
        'Mobile Apps',
        'Direct Sales',
    ],
}

export type CustomersListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCustomer: string[]   // ✅ ONLY IDs
}

type CustomersListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void

    setSelectedCustomer: (ids: string[]) => void
}

const initialState: CustomersListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCustomer: [],
}

export const useCustomerListStore = create<
    CustomersListState & CustomersListAction
>((set) => ({
    ...initialState,

    setFilterData: (payload) =>
        set(() => ({ filterData: payload })),

    setTableData: (payload) =>
        set(() => ({ tableData: payload })),

    // ✅ SIMPLE + SAFE
    setSelectedCustomer: (customers) =>
        set(() => ({ selectedCustomer: customers })),
}))