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
 * 🔥 Reusable truncated cell with tooltip
 */
const EllipsisCell = ({
    value,
    maxWidth = '200px',
}: {
    value: string
    maxWidth?: string
}) => {
    if (!value) return '-'

    return (
        <Tooltip title={value}>
            <div
                className="truncate"
                style={{ maxWidth }}
            >
                {value}
            </div>
        </Tooltip>
    )
}

const NameColumn = ({ row, searchQuery }: { row: any; searchQuery?: string }) => {
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
            to={`/assets/${row.id}`}
        >
            {highlightMatch(row.title, searchQuery)}
        </Link>
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

    /**
     * 🔎 Filter + sort
     */
    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()

        if (!query) return customerList

        const filtered = customerList.filter(customer =>
            customer.title.toLowerCase().includes(query)
        )

        return filtered.sort((a, b) => {
            const aTitle = a.title.toLowerCase()
            const bTitle = b.title.toLowerCase()

            if (aTitle === query) return -1
            if (bTitle === query) return 1

            if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1
            if (!aTitle.startsWith(query) && bTitle.startsWith(query)) return 1

            return 0
        })
    }, [customerList, tableData.query])

    const handleEdit = (customer: Customer) => {
        navigate(`/asset-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/assets/${customer.id}`)
    }

    /**
     * 📊 Columns
     */
    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => (
                    <NameColumn
                        row={props.row.original}
                        searchQuery={tableData.query as string}
                    />
                ),
            },
            {
                header: 'File Extension',
                accessorKey: 'file_extension',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.file_extension} maxWidth="120px" />
                ),
            },
            {
                header: 'File',
                accessorKey: 'file',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.file} />
                ),
            },
            {
                header: 'Asset Type Ref',
                accessorKey: 'asset_type_ref',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.asset_type_ref} />
                ),
            },
            {
                header: 'Asset Category',
                accessorKey: 'asset_category',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.asset_category} />
                ),
            },
            {
                header: 'Tags',
                accessorKey: 'tags',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.tags} />
                ),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.description} maxWidth="250px" />
                ),
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <div className="flex items-center gap-3">
                        <Tooltip title="Edit">
                            <div
                                className="text-xl cursor-pointer font-semibold"
                                onClick={() => handleEdit(props.row.original)}
                            >
                                <TbPencil />
                            </div>
                        </Tooltip>
                        <Tooltip title="View">
                            <div
                                className="text-xl cursor-pointer font-semibold"
                                onClick={() => handleViewDetails(props.row.original)}
                            >
                                <TbEye />
                            </div>
                        </Tooltip>
                    </div>
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

    const handleRowSelect = (checked: boolean, row: any) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<any>[]) => {
        if (checked) {
            setSelectAllCustomer(rows.map((r) => r.original))
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