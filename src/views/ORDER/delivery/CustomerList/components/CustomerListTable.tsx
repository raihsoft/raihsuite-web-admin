import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import CommonTable from '@/components/shared/CommonTable'
import useCustomerList from '../hooks/useCustomerList'
import { Link, useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Customer } from '../types'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row, searchQuery }: { row: Customer; searchQuery?: string }) => {
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
        <div className="flex items-center">
            <Avatar size={40} shape="circle" src={row.img} />
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                to={`/concepts/customers/customer-details/${row.id}`}
            >
                {highlightMatch(row.name, searchQuery)}
            </Link>
        </div>
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
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
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

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()

    const handleEdit = (customer: Customer) => {
        navigate(`/concepts/customers/customer-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/concepts/customers/customer-details/${customer.id}`)
    }

    // Filter and sort list - show only matches, with exact matches first
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()
        
        if (!query || query.length === 0) return customerList
        
        // Filter to only include matching names
        const filtered = customerList.filter(customer =>
            customer.name.toLowerCase().includes(query)
        )
        
        // Sort to put exact/partial matches first
        return filtered.sort((a, b) => {
            const aName = a.name.toLowerCase()
            const bName = b.name.toLowerCase()
            
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
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} searchQuery={tableData.query as string} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'location',
                accessorKey: 'personalInfo.location',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[row.status]}>
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Spent',
                accessorKey: 'totalSpending',
                cell: (props) => {
                    return <span>${props.row.original.totalSpending}</span>
                },
            },
            {
                header: '',
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
        <CommonTable
            data={filteredAndSortedList}
            total={customerListTotal}
            loading={isLoading}
            tableData={tableData}
            selectedItems={selectedCustomer}
            setSelectedItems={setSelectedCustomer}
            columns={columns}
        />
    )
}

export default CustomerListTable