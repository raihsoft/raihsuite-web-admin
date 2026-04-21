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
import { apiGetEmployees, apiGetOrganizations } from '@/services/CustomersService'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'
import { result } from 'lodash'

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

    const { data, error, isLoading } = useSWR(
        ['/api/organizations', { ...tableData, ...filterData }] as const,
        ([, params]) => apiGetOrganizations<GetCustomersListResponse, TableQueries>(params),
        { revalidateOnFocus: false }
    )
// console.log(data,"sssssssssss")
    // Map API response to table-friendly structure
const customerList = data?.results?.map((customer: any, index: number) => ({
    id: customer.id ?? index,
    organization_name: customer.organization_name,
    place: customer.place,
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
