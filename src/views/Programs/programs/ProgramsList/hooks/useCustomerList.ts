import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetProgramList } from '@/services/CustomersService'
import type { TableQueries } from '@/@types/common'
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

    const { data, error, isLoading } = useSWR(
        ['/programs', { ...tableData, ...filterData }] as const,
        ([, params]) =>
            apiGetProgramList<GetCustomersListResponse, TableQueries>(
                params
            ),
        { revalidateOnFocus: false }
        
    )
console.log('API RESPONSE', data)

const customerList =
    data?.data?.results?.map((customer: any, index: number) => ({
        id: customer.id ?? index,
        name: customer.name,
        code: customer.code,
        description: customer.description,
        tenant: customer.tenant,
        start_date: customer.start_date,
        end_date: customer.end_date,
    })) ?? []

const customerListTotal = data?.data?.count ?? 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}