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

const EllipsisCell = ({ value, maxWidth = '200px' }: any) => {
    if (!value) return '-'

    return (
        <Tooltip title={value}>
            <div className="truncate" style={{ maxWidth }}>
                {value}
            </div>
        </Tooltip>
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

    // =========================
    // EDIT / VIEW
    // =========================
    const handleEdit = (row: Customer) => {
        navigate(`/asset-edit/${row.id}`)
    }

    const handleViewDetails = (row: Customer) => {
        navigate(`/assets/${row.id}`)
    }

    // =========================
    // COLUMNS
    // =========================
    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => (
                    <Link
                        className="hover:text-primary font-semibold"
                        to={`/assets/${props.row.original.id}`}
                    >
                        {props.row.original.title}
                    </Link>
                ),
            },
            {
                header: 'File Extension',
                accessorKey: 'file_extension',
                cell: (props) => (
                    <EllipsisCell value={props.row.original.file_extension} />
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
                header: 'Category',
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
                                className="text-xl cursor-pointer"
                                onClick={() => handleEdit(props.row.original)}
                            >
                                <TbPencil />
                            </div>
                        </Tooltip>

                        <Tooltip title="View">
                            <div
                                className="text-xl cursor-pointer"
                                onClick={() => handleViewDetails(props.row.original)}
                            >
                                <TbEye />
                            </div>
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    )

    // =========================
    // TABLE HANDLERS
    // =========================
    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)

        if (selectedCustomer.length > 0) {
            setSelectAllCustomer([])
        }
    }

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
            data={customerList}   // ✅ IMPORTANT FIX
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
    )
}

export default CustomerListTable