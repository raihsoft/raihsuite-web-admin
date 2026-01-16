import { apiGetEventsList, apiGetSessionList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

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

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/events/sessions', { ...tableData, ...filterData }],
        ([_, params]) =>
            apiGetSessionList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Normalize API response shape
    const rawList: any[] = data?.list ?? data?.results ?? data ?? []

    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,

            title: item.title ?? '',
            start_datetime: item.start_datetime ?? '',
            end_datetime: item.end_datetime ?? '',
            day: item.day ?? '',
            speaker: item.speaker ?? '',
            location: item.location ?? '',
            event_title: item.event_title ?? '',

            // ✅ THIS IS THE IMPORTANT FIX
            referencedBy:
                item.referred_by ??
                item.referenced_by ??
                item.referencedBy ??
                '',
        }),
    )

    const customerListTotal =
        data?.total ??
        data?.count ??
        (Array.isArray(rawList) ? rawList.length : 0)

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
    }
}


