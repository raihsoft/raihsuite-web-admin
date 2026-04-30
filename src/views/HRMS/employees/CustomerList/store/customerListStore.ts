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
    purchaseChannel: [],
}

type CustomersListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCustomer: Customer[]
}

type CustomersListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedCustomer: (checked: boolean, customer: Customer) => void
    setSelectAllCustomer: (customers: Customer[]) => void
}

export const useCustomerListStore = create<
    CustomersListState & CustomersListAction
>((set) => ({
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCustomer: [],

    setFilterData: (payload) => set({ filterData: payload }),

    setTableData: (payload) => set({ tableData: payload }),

    // ✅ FIXED SELECTION LOGIC
    setSelectedCustomer: (checked, customer) =>
        set((state) => {
            if (!customer?.id) return state

            const exists = state.selectedCustomer.some(
                (item) => item.id === customer.id
            )

            // ✅ ADD
            if (checked) {
                if (exists) return state
                return {
                    selectedCustomer: [...state.selectedCustomer, customer],
                }
            }

            // ✅ REMOVE
            return {
                selectedCustomer: state.selectedCustomer.filter(
                    (item) => item.id !== customer.id
                ),
            }
        }),

    setSelectAllCustomer: (customers) =>
        set({
            selectedCustomer: customers || [],
        }),
}))