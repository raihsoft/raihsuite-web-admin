import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetEmployeeList } from '@/services/CustomersService'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'
import { useMemo } from 'react'

export default function useCustomerList() {

    const tableData = useCustomerListStore((s) => s.tableData)
    const filterData = useCustomerListStore((s) => s.filterData)
    const selectedCustomer = useCustomerListStore((s) => s.selectedCustomer)

    const setTableData = useCustomerListStore((s) => s.setTableData)
    const setSelectedCustomer = useCustomerListStore((s) => s.setSelectedCustomer)
    const setSelectAllCustomer = useCustomerListStore((s) => s.setSelectAllCustomer)
    const setFilterData = useCustomerListStore((s) => s.setFilterData)

    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10
    const offset = (pageIndex - 1) * pageSize

    const params = {
        limit: pageSize,
        offset,
        search: tableData.query || '',
        ...filterData,
    }

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/employees', pageIndex, pageSize, tableData.query, filterData],
        () =>
            apiGetEmployeeList<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )

    const customerList = useMemo(
        () =>
            (data?.results ?? []).map((c: any) => ({
                id: c.id,
                name: c.name,
                email: c.email_link,
                designation: c.designation,
                organization: c.organization,
                facebook: c.facebook_link,
                instagram: c.instagram_link,
                linkedin: c.linkedin_link,
                website: c.website_link,
            })),
        [data]
    )

    return {
        customerList,
        customerListTotal: data?.count ?? 0,
        error,
        isLoading,

        tableData,
        filterData,
        setTableData,
        setFilterData,

        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,

        mutate,
    }
}