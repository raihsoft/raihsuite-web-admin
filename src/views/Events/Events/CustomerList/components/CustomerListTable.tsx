import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import CommonTable from '@/components/shared/CommonTable'
import useCustomerList from '../hooks/useCustomerList'
import { Link, useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import cloneDeep from 'lodash/cloneDeep'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import type { TableQueries } from '@/@types/common'

const NameColumn = ({ row, searchQuery }: { row: Customer; searchQuery?: string }) => {
    const highlightMatch = (text: string, query?: string) => {
        if (!query) return text

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

    const displayName = row.name || `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()

    const initials = displayName
        .split(' ')
        .map((s) => s.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <div className="flex items-center">
            <Avatar className="!w-9 !h-9" alt={displayName}>
                {initials}
            </Avatar>
            <div className="ml-3">
                <Link
                    className="hover:text-primary font-semibold text-gray-900 dark:text-gray-100"
                    to={`/participants/${row.id}`}
                >
                    {highlightMatch(displayName, searchQuery)}
                </Link>
                {row.email && (
                    <div className="text-sm text-gray-500">{row.email}</div>
                )}
            </div>
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
                    className="text-xl cursor-pointer font-semibold"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer font-semibold"
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
        setTableData, // ✅ IMPORTANT
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()

    const handleEdit = (customer: Customer) => {
        navigate(`events/${customer.id}/edit`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/participants/${customer.id}`)
    }

    // ✅ Search only (NO sorting - backend handles order)
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()

        if (!query) return customerList

        return customerList.filter(customer =>
            (customer.name || '').toLowerCase().includes(query) ||
            (customer.email || '').toLowerCase().includes(query)
        )
    }, [customerList, tableData.query])

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => (
                    <NameColumn
                        row={props.row.original}
                        searchQuery={tableData.query as string}
                    />
                ),
            },
            {
                header: 'Place',
                accessorKey: 'place',
            },
            {
                header: 'Referenced By',
                accessorKey: 'referencedBy',
                cell: (props) => (
                    <Tag className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {props.row.original.referencedBy || '—'}
                    </Tag>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <div className="text-sm text-gray-500">
                        {props.row.original.email}
                    </div>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
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
        [tableData.query]
    )

    // 🔥 PAGINATION FIX
    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        setSelectAllCustomer([])
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

    return (
        <CommonTable
    data={filteredAndSortedList as any}
    total={customerListTotal}
    loading={isLoading}
    tableData={tableData}
    setTableData={setTableData}   // ✅ REQUIRED
    selectedItems={selectedCustomer as any}
    setSelectedItems={setSelectedCustomer as any}
    columns={columns}
/>
    )
}

export default CustomerListTable