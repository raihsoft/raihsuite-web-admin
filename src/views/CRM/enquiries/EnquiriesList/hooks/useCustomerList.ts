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
    const offset = (tableData.pageIndex - 1) * tableData.pageSize
    const limit = tableData.pageSize

    const swrKey = [
        '/api/enquiries',
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
            apiGetEnquiries<GetCustomersListResponse, any>(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
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


const customerList = useMemo(() => {
    if (error?.response?.status === 404) return []

    return (
        data?.results?.map((customer: any, index: number) => ({
            id: customer.id ?? index,
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            created_at: customer.created_at,
            message: customer.message,
            status: 'active',
            totalSpending: 0,
        })) ?? []
    )
}, [data?.results, error])

    const customerListTotal = useMemo(() => {
        if (error?.response?.status === 404) {
            return originalTotalRef.current
        }
        return apiTotal
    }, [apiTotal, error])

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