import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import { Link, useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import type { TableQueries } from '@/@types/common'

/**
 * 🔥 Reusable truncated cell
 */
const EllipsisCell = ({
    value,
    maxWidth = '250px',
}: {
    value?: string
    maxWidth?: string
}) => {
    if (!value) return '-'

    return (
        <Tooltip title={value}>
            <div className="truncate" style={{ maxWidth }}>
                {value}
            </div>
        </Tooltip>
    )
}

const NameColumn = ({ row, searchQuery }: { row: Customer; searchQuery?: string }) => {
    const highlightMatch = (text: string, query?: string) => {
        if (!query) return text

        const regex = new RegExp(`(${query})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-300 font-bold">
                    {part}
                </mark>
            ) : (
                part
            )
        )
    }

    return (
        <Link
            className="hover:text-primary font-semibold text-gray-900 dark:text-gray-100"
            to={`/asset-type-categories/${row.id}`}
        >
            {highlightMatch(row.name, searchQuery)}
        </Link>
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
        setTableData,
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()

    const handleEdit = (customer: Customer) => {
        navigate(`/asset-type-categories/${customer.id}/edit`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/asset-type-categories/${customer.id}`)
    }

    /**
     * 🔎 Filter + sort
     */
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()

        if (!query) return customerList

        const filtered = customerList.filter(customer =>
            customer.name.toLowerCase().includes(query)
        )

        return filtered.sort((a, b) => {
            const aName = a.name.toLowerCase()
            const bName = b.name.toLowerCase()

            if (aName === query) return -1
            if (bName === query) return 1

            if (aName.startsWith(query) && !bName.startsWith(query)) return -1
            if (!aName.startsWith(query) && bName.startsWith(query)) return 1

            return 0
        })
    }, [customerList, tableData.query])

    /**
     * 📊 Columns
     */
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
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.description} />
                ),
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() => handleViewDetails(props.row.original)}
                    />
                ),
            },
        ],
        [tableData.query]
    )

    /**
     * ⚙️ Table handlers
     */
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
            setSelectAllCustomer(rows.map((row) => row.original))
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
            checkboxChecked={(row) =>
                selectedCustomer.some((s) => s.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    </>
)
}

export default CustomerListTable