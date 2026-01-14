import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetEmployeeList } from '@/services/CustomersService'
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

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/employees', { ...tableData, ...filterData }] as const,
        ([, params]) =>
            apiGetEmployeeList<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

    // Map API response to table-friendly structure
    const customerList =
        data?.results?.map((customer: any, index: number) => ({
            id: customer.id ?? index,
            name: customer.name,
            email: customer.email_link,
            img: customer.profile_image,
            designation: customer.designation,
            organization: customer.organization,
            facebook: customer.facebook_link,
            instagram: customer.instagram_link,
            linkedin: customer.linkedin_link,
            website: customer.website_link,
            status: 'active',
            totalSpending: 0,
        })) ?? []

    const customerListTotal = data?.count ?? 0

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
        mutate, // ✅ expose mutate again
    }
}
