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
    } = useCustomerListStore()

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/events', { ...tableData, ...filterData }],
        ([_, params]) => apiGetEventsList(params),
        { revalidateOnFocus: false }
    )

    const rawList = data?.results ?? data ?? []

    const customerList = rawList.map((item: any) => ({
        id: item.id, 
        code: item.code,       // ✅ add this
        name: item.title || 'Untitled Event',
        startDate: item.start_date,
        endDate: item.end_date,
        place: item.place || '',
    }))


    const customerListTotal = data?.count ?? customerList.length

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
