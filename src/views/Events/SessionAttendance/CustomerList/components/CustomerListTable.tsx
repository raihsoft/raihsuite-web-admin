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

    return (
        <div className="flex items-center">
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                to={`/participants/${row.id}`}
            >
                {highlightMatch(displayName, searchQuery)}
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

const CustomerListTable = ({ eventId }: { eventId?: string }) => {
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
    } = useCustomerList(eventId)

    const handleEdit = (customer: Customer) => {
        navigate(`/session-attendance/edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/session-attendance/${customer.id}`)
    }

    // Filter and sort list - show only matches, with exact matches first
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()
        
        if (!query || query.length === 0) return customerList
        
        // Filter to include matching names, email, or event title
        const filtered = customerList.filter(customer =>
            (customer.session_title || '').toLowerCase().includes(query) ||
            (customer.participant_name || '').toLowerCase().includes(query) 
           
        )
        
        // Sort to put exact/partial matches first (by name)
        return filtered.sort((a, b) => {
            const aName = (a.participant_name || '').toLowerCase()
            const bName = (b.participant_name || '').toLowerCase()
            
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
                header: 'Session',
                accessorKey: 'session_title',
            },
            {
                header: 'Participant',
                accessorKey: 'participant_name',
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

           const start =
    customerListTotal === 0
        ? 0
        : (tableData.pageIndex - 1) * tableData.pageSize + 1

const end = Math.min(
    tableData.pageIndex * tableData.pageSize,
    customerListTotal
)
        

return (
    <>
        <div className="mb-4 text-sm text-gray-500">
            Showing {start} to {end} of {customerListTotal} entries
        </div>

        <DataTable
            selectable
            columns={columns}
            data={customerList}
            noData={!isLoading && customerList.length === 0}
            loading={isLoading}
            pagingData={{
                total: customerListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}

            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}

        />
    </>
)
}

export default CustomerListTable
