import { apiGetEventsList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'

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
    const offset = (pageIndex - 1) * pageSize

    const swrKey = [
        'participants',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
    ]

    const fetcher = () =>
        apiGetEventsList<GetCustomersListResponse, any>({
            limit: 1000, // 👈 IMPORTANT: load all once (or large number)
            offset: 0,
            search: tableData.query || '',
            ...filterData,
        })

    const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: false,
        keepPreviousData: true,
    })

    const rawList: any[] = data?.results ?? data?.list ?? []

    // =========================
    // MAP DATA
    // =========================
    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,

            event: item.event ?? '',

            firstName: item.first_name ?? '',
            lastName: item.last_name ?? '',

            name:
                item.participant_name ||
                `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim(),

            email: item.email ?? '',
            phone: item.phone ?? '',
            place: item.place ?? '',

            fee_amount: Number(item.fee_amount ?? 0),
            amount_paid: Number(item.amount_paid ?? 0),
            balance_due: Number(item.balance_due ?? 0),

            event_title: item.event_title ?? '',
        })
    )

    // =========================
    // 🔥 FRONTEND FILTER (MAIN FIX)
    // =========================
    const filteredList = eventId
        ? customerList.filter((p) => p.event === eventId)
        : customerList

    const customerListTotal = filteredList.length

    const paginatedList = filteredList.slice(offset, offset + pageSize)

    const clearSelection = () => {
        setSelectedCustomer([])
        setSelectAllCustomer([])
    }

    const updatePageSize = (size: number) => {
        setTableData({
            ...tableData,
            pageSize: size,
            pageIndex: 1,
        })
    }

    const updatePageIndex = (page: number) => {
        setTableData({
            ...tableData,
            pageIndex: page,
        })
    }

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
        clearSelection,
        updatePageSize,
        updatePageIndex,
    }
}