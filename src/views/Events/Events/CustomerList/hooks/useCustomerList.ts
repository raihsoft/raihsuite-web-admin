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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetEventsList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Debug: log API response for participants to help diagnose missing data
    // Remove or guard this in production
    // eslint-disable-next-line no-console
    console.debug('apiGetEventsList response', { data, error })

    // Normalize various API response shapes to the expected table-friendly structure
    // Support: { list: [], total }, { results: [], count }, or flat array
    const rawList: any[] = data?.list ?? data?.results ?? data ?? []

    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,
            firstName: item.first_name || item.firstName || '',
            lastName: item.last_name || item.lastName || '',
            name:
                item.name ||
                item.full_name ||
                `${item.first_name ?? item.firstName ?? ''} ${item.last_name ?? item.lastName ?? ''}`.trim() ||
                item.email ||
                `Participant ${index + 1}`,
            email: item.email || item.participant_email || '',
            phone: item.phone || item.phone_number || item.contact_number || '',
            place: item.place || '',
            referencedBy: item.referenced_by ?? item.referred_by ?? item.referencedBy ?? '',

        }),
    )

    const customerListTotal = data?.total ?? data?.count ?? (Array.isArray(rawList) ? rawList.length : 0)

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
