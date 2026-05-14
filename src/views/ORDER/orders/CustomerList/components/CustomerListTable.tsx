import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import CommonTable from '@/components/shared/CommonTable'
import useCustomerList from '../hooks/useCustomerList'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Customer } from '../types'

const NameColumn = ({ row, searchQuery }: { row: any; searchQuery?: string }) => {
    const highlightMatch = (text: string, query?: string) => {
        if (!query || query.length === 0) return text
        
        const regex = new RegExp(`(${query})`, 'gi')
        const parts = text.split(regex)
        
        return parts.map((part, i) => 
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-300 font-bold">{part}</mark>
            ) : (
                part
            )
        )
    }
    
    return (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
            {highlightMatch(row.order_by_name, searchQuery)}
        </span>
    )
}

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

    // Filter and sort list - show only matches, with exact matches first
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()
        
        if (!query || query.length === 0) return customerList
        
        // Filter to only include matching order names
        const filtered = customerList.filter(customer =>
            customer.order_by_name.toLowerCase().includes(query)
        )
        
        // Sort to put exact/partial matches first
        return filtered.sort((a, b) => {
            const aName = a.order_by_name.toLowerCase()
            const bName = b.order_by_name.toLowerCase()
            
            // Exact match comes first
            if (aName === query) return -1
            if (bName === query) return 1
            
            // Starts with query comes next
            if (aName.startsWith(query) && !bName.startsWith(query)) return -1
            if (!aName.startsWith(query) && bName.startsWith(query)) return 1
            
            return 0
        })
    }, [customerList, tableData.query])

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'order_by_name',
                cell: (props) => <NameColumn row={props.row.original} searchQuery={tableData.query as string} />
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

    return (
        <div>
            <div className="flex gap-4 mb-4">
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

            <CommonTable
                data={filteredAndSortedList as any}
                total={customerListTotal}
                loading={isLoading}
                tableData={tableData}
                selectedItems={selectedCustomer as any}
                setSelectedItems={setSelectedCustomer as any}
                columns={columns}
            />
        </div>
    )
}

export default CustomerListTable