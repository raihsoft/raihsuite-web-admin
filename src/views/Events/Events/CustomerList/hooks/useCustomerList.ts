import { useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetEventsList } from '@/services/CustomersService'

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

    const limit = tableData.pageSize
    const offset = (tableData.pageIndex - 1) * tableData.pageSize

    useEffect(() => {
    console.log("PAGE INDEX:", tableData.pageIndex)
    console.log("OFFSET:", offset)
}, [tableData.pageIndex, offset])

    const swrKey = [
        '/api/events',
        {
            limit,
            offset,
            ordering: '-created_at',
            ...filterData,
        },
    ]

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, params]) => apiGetEventsList(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
        
    )

    

    // ✅ correct backend response handling
    const rawList = data?.results ?? []

    // ❌ DO NOT rely on frontend sorting unless backend is wrong
    const customerList = useMemo(() => {
        return rawList.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.participant_name || 'Untitled',
            startDate: item.start_date,
            endDate: item.end_date,
            place: item.place || '',
            feeAmount: Number(item.fee_amount) || 0,
        }))
    }, [rawList])

    const customerListTotal = data?.count ?? 0

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