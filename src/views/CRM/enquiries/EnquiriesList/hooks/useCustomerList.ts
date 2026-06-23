import { useMemo, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'
import { apiGetEnquiries } from '@/services/CustomersService'

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

    const originalTotalRef = useRef(0)

    // 🔥 OFFSET FIX
    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10
    const limit = tableData.query ? 1000 : pageSize
    const offset = tableData.query ? 0 : (pageIndex - 1) * pageSize

    const swrKey = [
        '/api/enquiries',
        pageIndex,
        pageSize,
        tableData.query || '',
        JSON.stringify(filterData || {}),
    ] as const

    const fetcher = () =>
        apiGetEnquiries<GetCustomersListResponse, any>({
            offset,
            limit,
            ordering: '-created_at',
            search: tableData.query || '',
            ...filterData,
        })

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        }
    )

    useEffect(() => {
        if (!data?.results) return

        console.log("========== API DEBUG ==========")
        console.log("PAGE:", tableData.pageIndex)
        console.log(
            "created_at list:",
            data.results.map((i: any) => i.created_at)
        )
    }, [data, tableData.pageIndex])

    const apiTotal =
        data?.count ?? data?.total ?? data?.total_count ?? 0

    useEffect(() => {
        if (apiTotal > 0 && originalTotalRef.current === 0) {
            originalTotalRef.current = apiTotal
        }
    }, [apiTotal])


    const mappedList = useMemo(() => {
        if (error?.response?.status === 404) return []

        return (
            data?.results?.map((customer: any, index: number) => ({
                id: customer.id ?? index,
                name: customer.name ?? '',
                email: customer.email ?? '',
                mobile: customer.mobile ?? '',
                created_at: customer.created_at,
                message: customer.message ?? '',
                status: 'active',
                totalSpending: 0,
            })) ?? []
        )
    }, [data?.results, error])

    const filteredList = useMemo(() => {
        const query = (tableData.query || '').toLowerCase().trim()
        if (!query) return mappedList

        return mappedList.filter(customer =>
            (customer.name || '').toLowerCase().includes(query) ||
            (customer.email || '').toLowerCase().includes(query) ||
            (customer.mobile || '').toLowerCase().includes(query) ||
            (customer.message || '').toLowerCase().includes(query)
        )
    }, [mappedList, tableData.query])

    const customerListTotal = useMemo(() => {
        if (error?.response?.status === 404) {
            return originalTotalRef.current
        }
        return tableData.query ? filteredList.length : apiTotal
    }, [apiTotal, error, tableData.query, filteredList.length])

    const paginatedList = useMemo(() => {
        if (tableData.query) {
            const queryOffset = (pageIndex - 1) * pageSize
            return filteredList.slice(queryOffset, queryOffset + pageSize)
        }
        return filteredList
    }, [filteredList, tableData.query, pageIndex, pageSize])

    // 🔥 SAFE PAGE FIX (NO 403, NO EMPTY PAGE LOOP)
    useEffect(() => {
        const maxPage = Math.ceil(customerListTotal / tableData.pageSize)

        if (tableData.pageIndex > maxPage && maxPage > 0) {
            setTableData((prev: TableQueries) => ({
                ...prev,
                pageIndex: maxPage,
            }))
        }
    }, [customerListTotal, tableData.pageIndex, tableData.pageSize, setTableData])

    // reset page on filter change
    const prevFilterRef = useRef(filterData)

    useEffect(() => {
        if (prevFilterRef.current !== filterData) {
            prevFilterRef.current = filterData

            setTableData((prev: TableQueries) => ({
                ...prev,
                pageIndex: 1,
            }))
        }
    }, [filterData, setTableData])

    return {
        customerList: paginatedList,
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
        mutate,
    }
}