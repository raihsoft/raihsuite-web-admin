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

export const initialFilterData: Filter = {
    purchasedProducts: '',
    purchaseChannel: [
        'Retail Stores',
        'Online Retailers',
        'Resellers',
        'Mobile Apps',
        'Direct Sales',
    ],
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

    // ✅ FIXED
    setSelectedCustomer: (checked, customer) =>
        set((state) => {
            if (checked) {
                if (state.selectedCustomer.some(c => c.id === customer.id)) {
                    return state
                }
                return {
                    selectedCustomer: [...state.selectedCustomer, customer],
                }
            }

            return {
                selectedCustomer: state.selectedCustomer.filter(
                    (c) => c.id !== customer.id
                ),
            }
        }),

    // ✅ FIXED
    setSelectAllCustomer: (customers) =>
        set({ selectedCustomer: customers }),
}))
