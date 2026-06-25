import { apiGetFeePaymentList } from '@/services/CustomersService'
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
        '/events/fee-payments/',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
        eventId ?? '',
    ]

    // =========================
    // Fetcher with correct params
    // =========================
    const fetcher = () =>
        apiGetFeePaymentList<GetCustomersListResponse, any>({
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
    // Normalize response
    // =========================
    const rawList: any[] = data?.results ?? data?.list ?? []

    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item: any, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,

            participant_name: item.participant_name ?? '',
            fee_amount: Number(item.fee_amount ?? 0),
            payment_type: item.payment_type ?? '',
            event: item.event ?? item.event_id ?? item.participant_event ?? item.participant_event_id ?? '',
        })
    )

    const filteredList = eventId
        ? customerList.filter((p) => !p.event || String(p.event) === String(eventId))
        : customerList

    const customerListTotal = eventId ? filteredList.length : (data?.count ?? data?.total ?? 0)

    const paginatedList = eventId
        ? filteredList.slice(offset, offset + pageSize)
        : customerList

    // =========================
    // Selection reset helper
    // =========================
    const clearSelection = () => {
        setSelectedCustomer([])
        setSelectAllCustomer([])
    }

    // =========================
    // Page helpers (optional but recommended)
    // =========================
    const updatePageIndex = (page: number) => {
        setTableData({
            ...tableData,
            pageIndex: page,
        })
    }

    const updatePageSize = (size: number) => {
        setTableData({
            ...tableData,
            pageSize: size,
            pageIndex: 1,
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
        updatePageIndex,
        updatePageSize,
    }
}