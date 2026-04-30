import { apiGetEventsList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'

export default function useCustomerList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    // =========================
    // Pagination
    // =========================
    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10

    const offset = (pageIndex - 1) * pageSize

    // =========================
    // FIX: stable SWR key (NO OFFSET HERE)
    // =========================
    const swrKey = [
        'participants',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
    ]

    // =========================
    // FIX: fetcher uses latest params
    // =========================
    const fetcher = () =>
        apiGetEventsList<GetCustomersListResponse, any>({
            limit: pageSize,
            offset,
            search: tableData.query || '',
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
    // Normalize response
    // =========================
    const rawList: any[] = data?.results ?? data?.list ?? []

    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,

            firstName: item.first_name ?? '',
            lastName: item.last_name ?? '',

            name:
                item.name ||
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

    const customerListTotal =
        data?.count ??
        data?.total ??
        0

    // =========================
    // FIX: selection reset helper
    // =========================
    const clearSelection = () => {
        setSelectedCustomer([])
        setSelectAllCustomer([])
    }

    // =========================
    // FIX: page size change resets page
    // =========================
    const updatePageSize = (size: number) => {
        setTableData({
            ...tableData,
            pageSize: size,
            pageIndex: 1,
        })
    }

    // =========================
    // FIX: page change
    // =========================
    const updatePageIndex = (page: number) => {
        setTableData({
            ...tableData,
            pageIndex: page,
        })
    }

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
        clearSelection,
        updatePageSize,
        updatePageIndex,
    }
}