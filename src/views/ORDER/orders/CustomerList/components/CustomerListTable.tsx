import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import { Link, useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import type { TableQueries } from '@/@types/common'

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const CustomerListTable = () => {
    const navigate = useNavigate()
    const [selectOrder, setSelectOrder] = useState<string>('');
    const [selectedOrganization, setSelectedOrganization] = useState<string>('');
    const [filterData, setFilterData] = useState<TableQueries>({});


    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList(selectOrder, selectedOrganization)

    const handleEdit = (customer: Customer) => {
        navigate(`/order-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Customer) => {
        // navigate(/order-details/${customer.id})
    }

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'order_by_name',
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
            },
            {
                header: 'Delivery Place',
                accessorKey: 'delivery_place',
            },
            {
                header: 'Zone',
                accessorKey: 'zone_name',
            },
            {
                header: 'Order Type',
                accessorKey: 'order_type',
            },
            {
                header: 'Organization Name',
                accessorKey: 'organization_name',
            },
            {
                header: 'Order Number',
                accessorKey: 'order_number',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
             {
                header: 'Payment Status',
                accessorKey: 'is_paid',
            },
             {
                header: 'Payment Note',
                accessorKey: 'payment_note',
            },

            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedCustomer.length > 0) {
            setSelectAllCustomer([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Customer) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCustomer(originalRows)
        } else {
            setSelectAllCustomer([])
        }
    }

    console.log('customerList', customerList)

    return (

        <div>


            <div className="flex gap-4 mb-4">

                {/* <select
                    value={selectOrder}
                    onChange={(e) => setSelectOrder(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Select zone</option>
                    {Array.from(new Set(customerList.map((customer:any) => customer.zone_name))).map(
                        (zone_name) => (
                        <option key={zone_name} value={zone_name}>
                            {zone_name}
                        </option>
                    ))}
                </select> */}

                 <select
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Select organization</option>
                    {Array.from(new Set(customerList.map((customer:any) => customer.organization_name))).map(
                        (organization_name) => (
                        <option key={organization_name} value={organization_name}>
                            {organization_name}
                        </option>
                    ))}
                </select>

                {/* Reset Filters Button */}
                <button
                    onClick={() => {

                        setSelectOrder('')
                        setSelectedOrganization('')
                    }}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Reset Filters
                </button>
            </div>

        <DataTable
            selectable
            columns={columns}
            data={customerList}
            noData={!isLoading && customerList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: customerListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedCustomer.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
        </div>
    )
}

export default CustomerListTable