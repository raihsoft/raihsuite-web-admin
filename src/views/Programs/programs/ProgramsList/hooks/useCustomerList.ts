import { useMemo, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'
import { apiGetProgramList } from '@/services/CustomersService'

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

    // ✅ pagination
    const offset = (tableData.pageIndex - 1) * tableData.pageSize
    const limit = tableData.pageSize

    // ✅ FIXED SWR KEY (important for caching)
    const swrKey = [
        '/programs/programs/',
        {
            offset,
            limit,
            ordering: '-created_at',
            ...filterData,
        },
    ] as const

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([, params]) =>
            apiGetProgramList<GetCustomersListResponse, any>(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    )

    // 🔍 DEBUG
    useEffect(() => {
        // console.log('SWR RAW DATA:', data)
        // console.log('SWR ERROR:', error)
    }, [data, error])

    // ✅ SAFE API RESPONSE HANDLING
    const apiResponse = data?.data ?? data

    const results = apiResponse?.results ?? []

    const apiTotal =
        apiResponse?.count ??
        apiResponse?.total ??
        apiResponse?.total_count ??
        0

    // store first valid total
    useEffect(() => {
        if (apiTotal > 0 && originalTotalRef.current === 0) {
            originalTotalRef.current = apiTotal
        }
    }, [apiTotal])

    // ✅ MAP DATA SAFELY
    const customerList = useMemo(() => {
        if (error?.response?.status === 404) return []

        return results.map((customer: any, index: number) => ({
            id: customer.id ?? index,

            // your fields
            name: customer.name,
            code: customer.code,
            description: customer.description,
            start_date: customer.start_date,
            end_date: customer.end_date,
         
        }))
    }, [results, error])

    // ✅ TOTAL HANDLING
    const customerListTotal = useMemo(() => {
        if (error?.response?.status === 404) {
            return originalTotalRef.current
        }
        return apiTotal
    }, [apiTotal, error])

    // ✅ SAFE PAGE FIX
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
        mutate,
    }
}