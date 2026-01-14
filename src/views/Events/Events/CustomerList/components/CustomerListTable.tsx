import { useMemo } from 'react'
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

    const displayName = row.name || `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()

    const initials = (row.name || `${row.firstName ?? ''} ${row.lastName ?? ''}`)
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
                    className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100`}
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
        setTableData,
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

    // Filter and sort list - show only matches, with exact matches first
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()
        
        if (!query || query.length === 0) return customerList
        
        // Filter to include matching names or email
        const filtered = customerList.filter(customer =>
            (customer.name || '').toLowerCase().includes(query) ||
            (customer.email || '').toLowerCase().includes(query)
        )
        
        // Sort to put exact/partial matches first
        return filtered.sort((a, b) => {
            const aName = (a.name || '').toLowerCase()
            const bName = (b.name || '').toLowerCase()
            
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
                header: 'Place',
                accessorKey: 'place',
            },
            {
                header: 'Referenced By',
                accessorKey: 'referencedBy',
                cell: (props) => (
                    <Tag className="uppercase text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {props.row.original.referencedBy || '—'}
                    </Tag>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <div className="text-sm text-gray-500">{props.row.original.email}</div>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
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

    return (
        <DataTable
            selectable
            columns={columns}
            data={filteredAndSortedList}
            noData={!isLoading && filteredAndSortedList.length === 0}
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
    )
}

export default CustomerListTable
