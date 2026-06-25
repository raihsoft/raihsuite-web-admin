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

    // Load all up to 1000 when searching, otherwise paginate
    const limit = tableData.query ? 1000 : pageSize
    const offset = tableData.query ? 0 : (pageIndex - 1) * pageSize

    const params = {
        limit,
        offset,
        ...filterData,
    }

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/employees', pageIndex, pageSize, tableData.query, JSON.stringify(filterData || {})],
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

    const filteredList = useMemo(() => {
        const query = (tableData.query || '').toLowerCase().trim()
        if (!query) return customerList

        return customerList.filter(c =>
            (c.name || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            (c.designation || '').toLowerCase().includes(query) ||
            (c.organization || '').toLowerCase().includes(query)
        )
    }, [customerList, tableData.query])

    const customerListTotal = useMemo(() => {
        return tableData.query ? filteredList.length : (data?.count ?? 0)
    }, [data?.count, tableData.query, filteredList.length])

    const paginatedList = useMemo(() => {
        if (tableData.query) {
            const queryOffset = (pageIndex - 1) * pageSize
            return filteredList.slice(queryOffset, queryOffset + pageSize)
        }
        return filteredList
    }, [filteredList, tableData.query, pageIndex, pageSize])

    return {
        customerList: paginatedList,
        customerListTotal,
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