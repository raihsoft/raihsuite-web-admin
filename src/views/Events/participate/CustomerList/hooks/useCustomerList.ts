import { apiGetEventsList } from '@/services/CustomersService'
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
        ['/api/events/participants', { ...tableData, ...filterData }],
        ([_, params]) =>
            apiGetEventsList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Normalize API response shape
    const rawList: any[] = data?.list ?? data?.results ?? data ?? []

    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,

            firstName: item.first_name ?? item.firstName ?? '',
            lastName: item.last_name ?? item.lastName ?? '',

            name:
                item.name ||
                item.full_name ||
                `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim(),

            email: item.email ?? '',
            phone: item.phone ?? item.phone_number ?? '',
            place: item.place ?? '',
            balance_due: parseFloat(item.balance_due) ,
            amount_paid: parseFloat(item.amount_paid) ,
            fee_amount: parseFloat(item.fee_amount) ,
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
