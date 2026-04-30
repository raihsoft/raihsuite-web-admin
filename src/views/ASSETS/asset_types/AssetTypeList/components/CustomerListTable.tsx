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
    maxWidth = '200px',
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

const NameColumn = ({
    row,
    searchQuery,
}: {
    row: Customer
    searchQuery?: string
}) => {
    return (
        <Link
            className="hover:text-primary font-semibold text-gray-900 dark:text-gray-100"
            to={`/asset-types/${row.id}`}
        >
            {row.name}
        </Link>
    )
}

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => (
    <div className="flex items-center gap-3">
        <Tooltip title="Edit">
            <div className="text-xl cursor-pointer font-semibold" onClick={onEdit}>
                <TbPencil />
            </div>
        </Tooltip>

        <Tooltip title="View">
            <div className="text-xl cursor-pointer font-semibold" onClick={onViewDetail}>
                <TbEye />
            </div>
        </Tooltip>
    </div>
)

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
     * ⚠️ IMPORTANT:
     * DO NOT filter frontend data → breaks pagination
     */
    const tableList = useMemo(() => customerList, [customerList])

    const handleEdit = (customer: Customer) => {
        navigate(`/assettypes-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/asset-types/${customer.id}`)
    }

    /**
     * ⚙️ SAFE table update (important fix)
     */
    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)

        // reset selection on page change
        if (selectedCustomer.length > 0) {
            setSelectAllCustomer([])
            setSelectedCustomer([])
        }
    }

    /**
     * 📄 Pagination FIX (most important)
     */
    const handlePaginationChange = (page: number) => {
        const newData = cloneDeep(tableData)
        newData.pageIndex = page
        handleSetTableData(newData)
    }

    const handleSelectChange = (value: number) => {
        const newData = cloneDeep(tableData)
        newData.pageSize = Number(value)
        newData.pageIndex = 1
        handleSetTableData(newData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newData = cloneDeep(tableData)
        newData.sort = sort
        handleSetTableData(newData)
    }

    const handleRowSelect = (checked: boolean, row: Customer) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
        if (checked) {
            setSelectAllCustomer(rows.map((r) => r.original))
        } else {
            setSelectAllCustomer([])
        }
    }

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
                header: 'Code',
                accessorKey: 'code',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.code} maxWidth="120px" />
                ),
            },
            {
                header: 'File Extension',
                accessorKey: 'file_extension',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.file_extension} maxWidth="150px" />
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
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() => handleViewDetails(props.row.original)}
                    />
                ),
            },
        ],
        [tableData.query]
    )

    return (
        <DataTable
            selectable
            columns={columns}
            data={tableList}

            noData={!isLoading && tableList.length === 0}
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
    )
}

export default CustomerListTable