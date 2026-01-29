import { apiGetEvents } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '@/views/Events/Events/CustomerList/store/customerListStore'
import type { TableQueries } from '@/@types/common'

export type EventItem = {
    id: string
    title: string
    code?: string
    start_date?: string
    end_date?: string
}

export default function useEventsList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/events/events', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetEvents<any, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Normalize response
    const rawList: any[] = data?.list ?? data?.results ?? data ?? []

    const eventsList: EventItem[] = (Array.isArray(rawList) ? rawList : []).map(
        (item: any, index: number) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,
            title: item.title || item.name || '',
            code: item.code || item.event_code || '',
             fee_amount: item.fee_amount,
            start_date: item.start_date || item.start_date_time || item.start || '',
            end_date: item.end_date || item.end_date_time || item.end || '',
        }),
    )

    const eventsTotal = data?.total ?? data?.count ?? (Array.isArray(rawList) ? rawList.length : 0)

    return {
        eventsList,
        eventsTotal,
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
        
    }
}
