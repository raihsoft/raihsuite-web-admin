import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import { apiGetOrderList } from '@/services/CustomersService'
import type { TableQueries } from '@/@types/common'
import type { GetCustomersListResponse } from '../types'

export default function useCustomerList(selectOrder: string = '', selectedOrganization: string = '') {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    // Build query params with tableData + filterData + zone/org filters
    const buildQueryParams = () => {
        const params: TableQueries = { ...tableData, ...filterData }

        if (selectOrder) {
            params.zone_name = selectOrder
        }
        if (selectedOrganization) {
            params.organization__organization_name = selectedOrganization
        }

        // console.log("params", params)
        return params
    }

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/orders', buildQueryParams()],
        ([, params]) =>
             apiGetOrderList<GetCustomersListResponse, TableQueries>(params),
        { 
            revalidateOnFocus: false 
        }
    )

    // Map API response
    const customerList = data?.results?.map((customer: any, index: number) => ({
        id: customer.id ?? index,
        order_by_name: customer.order_by_name,
        mobile: customer.mobile,
        quantity: customer.quantity,
        delivery_place: customer.delivery_place,
        zone_name: customer.zone_name,
        zone_id: customer.zone_id,
        order_number: customer.order_number,
        order_type: customer.order_type,
        order_type_display: customer.order_type_display,
        organization: customer.organization,
        organization_name: customer.organization_name,
        Payment_note: customer.payment_note,
        payment_status: customer.ispaid ? 'paid' : 'unpaid',
        status: customer.status,
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
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}
