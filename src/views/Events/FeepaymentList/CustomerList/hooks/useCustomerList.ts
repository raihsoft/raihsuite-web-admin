import { apiGetEventsList, apiGetFeePaymentList, apiGetSessionList } from '@/services/CustomersService'
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
        ['/events/fee-payments/', { ...tableData, ...filterData }],
        ([_, params]) =>
            apiGetFeePaymentList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Normalize API response shape
    const rawList: any[] = data?.list ?? data?.results ?? data ?? []

    const customerList = (Array.isArray(rawList) ? rawList : []).map(
        (item, index) => ({
            id: item.id ?? item.pk ?? `tmp-${index}`,
            "participant_name": item.participant_name ?? '',
            "fee_amount": item.fee_amount ?? '',
            "payment_type": item.payment_type ?? '',

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


