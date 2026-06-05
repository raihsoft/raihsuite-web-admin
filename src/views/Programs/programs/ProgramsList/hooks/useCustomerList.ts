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
    } = useCustomerListStore(
        (state) => state,
    )

    // =========================
    // KEEP ORIGINAL TOTAL
    // =========================
    const originalTotalRef = useRef(0)

    // =========================
    // BACKEND PAGINATION
    // =========================
    const offset =
        ((tableData.pageIndex ?? 1) - 1) *
        (tableData.pageSize ?? 10)

    const limit = tableData.pageSize ?? 10

    // =========================
    // SWR KEY
    // =========================
    const swrKey = [
        '/programs/programs/',
        {
            offset,
            limit,
            ordering: '-created_at',

            ...filterData,
        },
    ] as const

    // =========================
    // API CALL
    // =========================
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        swrKey,

        ([, params]) =>
            apiGetProgramList<
                GetCustomersListResponse,
                any
            >(params),

        {
            revalidateOnFocus: false,

            shouldRetryOnError: false,
        },
    )

    // =========================
    // DEBUG
    // =========================
    useEffect(() => {
        console.log(
            'SWR RAW DATA:',
            data,
        )

        console.log(
            'SWR ERROR:',
            error,
        )
    }, [data, error])

    // =========================
    // SAFE RESPONSE
    // =========================
    const apiResponse =
        (data as any)?.data ?? data

    const results =
        apiResponse?.results ?? []

    const apiTotal =
        apiResponse?.count ??
        apiResponse?.total ??
        apiResponse?.total_count ??
        0

    // =========================
    // STORE FIRST TOTAL
    // =========================
    useEffect(() => {
        if (
            apiTotal > 0 &&
            originalTotalRef.current === 0
        ) {
            originalTotalRef.current =
                apiTotal
        }
    }, [apiTotal])

    // =========================
    // MAP TABLE DATA
    // =========================
    const customerList = useMemo(() => {
        if (
            error?.response?.status ===
            404
        ) {
            return []
        }

        return results.map(
            (
                customer: any,
                index: number,
            ) => ({
                id:
                    customer.id ?? index,

                name: customer.name,

                code: customer.code,

                description:
                    customer.description,

                start_date:
                    customer.start_date,

                end_date:
                    customer.end_date,

                is_active:
                    customer.is_active,
            }),
        )
    }, [results, error])

    // =========================
    // TOTAL COUNT
    // =========================
    const customerListTotal =
        useMemo(() => {
            if (
                error?.response
                    ?.status === 404
            ) {
                return originalTotalRef.current
            }

            return apiTotal
        }, [apiTotal, error])

    // =========================
    // AUTO FIX EMPTY PAGE
    // =========================
    useEffect(() => {
        const pageSize = tableData.pageSize ?? 10
        const pageIndex = tableData.pageIndex ?? 1
        const maxPage = Math.ceil(
            customerListTotal /
                pageSize,
        )

        if (
            pageIndex >
                maxPage &&
            maxPage > 0
        ) {
            setTableData({
                ...tableData,

                pageIndex: maxPage,
            })
        }
    }, [
        customerListTotal,
        tableData,
        setTableData,
    ])

    // =========================
    // RESET PAGE ON FILTER
    // =========================
    const prevFilterRef =
        useRef(filterData)

    useEffect(() => {
        if (
            prevFilterRef.current !==
            filterData
        ) {
            prevFilterRef.current =
                filterData

            setTableData({
                ...tableData,

                pageIndex: 1,
            })
        }
    }, [
        filterData,
        tableData,
        setTableData,
    ])

    // =========================
    // RETURN
    // =========================
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