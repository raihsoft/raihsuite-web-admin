// import { apiGetEmployees } from '@/services/CustomersService'
// import useSWR from 'swr'
// import { useCustomerListStore } from '../store/customerListStore'
// import type { GetCustomersListResponse } from '../types'
// import type { TableQueries } from '@/@types/common'

// export default function useCustomerList() {
    
//     const {
//         tableData,
//         filterData,
//         setTableData,
//         selectedCustomer,
//         setSelectedCustomer,
//         setSelectAllCustomer,
//         setFilterData,
//     } = useCustomerListStore((state) => state)

//     const { data, error, isLoading, mutate } = useSWR(
//         ['/api/employees', { ...tableData, ...filterData }],

//         ([_, params]) =>
//             apiGetEmployees<GetCustomersListResponse, TableQueries>(params),
//         {
//             revalidateOnFocus: false,
//         },
//     )

//     const customerList = data?.list || []

//     const customerListTotal = data?.total || 0

//     return {
//         customerList,
//         customerListTotal,
//         error,
//         isLoading,
//         tableData,
//         filterData,
//         mutate,
//         setTableData,
//         selectedCustomer,
//         setSelectedCustomer,
//         setSelectAllCustomer,
//         setFilterData,
//     }
// }


import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetZones } from '@/services/ZoneService'
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

    // Get current page index and page size with defaults
    const pageIndex = tableData.pageIndex ?? 1
    const pageSize = tableData.pageSize ?? 10

    // Convert pageIndex/pageSize to offset/limit for API
    const apiParams = {
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize,
        ordering: tableData.sort?.key ? `${tableData.sort.order === 'desc' ? '-' : ''}${tableData.sort.key}` : undefined,
        search: tableData.query || undefined,
    }

    const { data, error, isLoading } = useSWR(
        ['/api/zones', apiParams] as const,
        ([, params]) => apiGetZones<GetCustomersListResponse>(params),
        { revalidateOnFocus: false }
    )

    // Map API response to table-friendly structure
    const customerList = data?.results?.map((customer: any, index: number) => ({
        id: customer.id ?? index,
        zone_name: customer.zone_name,
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
    }
}
