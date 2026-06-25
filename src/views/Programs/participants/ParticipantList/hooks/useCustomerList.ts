import { useMemo, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse, Customer } from '../types'
import { apiGetProgramparticipantList } from '@/services/CustomersService'

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

    // =========================
    // STORE ORIGINAL TOTAL
    // =========================
    const originalTotalRef = useRef(0)

    // =========================
    // PAGINATION
    // =========================
    const offset =
        ((tableData.pageIndex ?? 1) - 1) *
        (tableData.pageSize ?? 10)

    const limit = tableData.pageSize ?? 10

    // =========================
    // SWR KEY
    // =========================
    const swrKey = [
        '/programs/participants/',
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
            apiGetProgramparticipantList<
                GetCustomersListResponse,
                any
            >(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    )

    // =========================
    // DEBUG
    // =========================
    useEffect(() => {
        console.log('PARTICIPANT API:', data)
        console.log('PARTICIPANT ERROR:', error)
    }, [data, error])

    const apiResponse =
        data ?? ({} as Partial<GetCustomersListResponse>)

    const results =
        apiResponse?.results ?? []

    const apiTotal =
        apiResponse?.count ??
        apiResponse?.total ??
        apiResponse?.total_count ??
        0

    const parseCustomData = (
        customData: unknown
    ): Record<string, unknown> => {
        if (customData === null || customData === undefined) {
            return {}
        }

        if (typeof customData === 'string') {
            try {
                return JSON.parse(customData) as Record<
                    string,
                    unknown
                >
            } catch {
                return {}
            }
        }

        if (
            typeof customData === 'object' &&
            !Array.isArray(customData)
        ) {
            return customData as Record<
                string,
                unknown
            >
        }

        return {}
    }

    // =========================
    // SAVE ORIGINAL TOTAL
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
    // MAP PARTICIPANTS
    // =========================
    const customerList = useMemo<Customer[]>(() => {
        if (
            error?.response?.status === 404
        ) {
            return []
        }

        return results.map(
            (
                customer: any,
                index: number
            ) => ({
                id:
                    customer.id ?? index,

                program_name:
                    customer.program_name ??
                    '',

                first_name:
                    customer.first_name ??
                    '',

                last_name:
                    customer.last_name ??
                    '',

                participant_name:
                    customer.participant_name ??
                    '',

                email:
                    customer.email ?? '',

                phone:
                    customer.phone ?? '',

                place:
                    customer.place ?? '',

                custom_data: parseCustomData(
                    customer.custom_data,
                ),

                created_at:
                    customer.created_at ??
                    '',

                status: 'active',
            })
        )
    }, [results, error])

    // =========================
    // TOTAL COUNT
    // =========================
    const customerListTotal =
        useMemo(() => {
            if (
                error?.response?.status ===
                404
            ) {
                return originalTotalRef.current
            }

            return apiTotal
        }, [apiTotal, error])

    // =========================
    // FIX EMPTY PAGE AFTER DELETE
    // =========================
    useEffect(() => {
        const pageSize = tableData.pageSize ?? 10
        const pageIndex = tableData.pageIndex ?? 1
        const maxPage = Math.ceil(
            customerListTotal /
                pageSize
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
    }, [filterData, tableData, setTableData])

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