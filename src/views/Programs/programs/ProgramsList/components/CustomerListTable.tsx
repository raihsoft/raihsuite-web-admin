import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import CustomerListActionTools from '../components/CustomerListActionTools'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbEye, TbPencil } from 'react-icons/tb'
import type {
    OnSortParam,
    ColumnDef,
    Row,
} from '@/components/shared/DataTable'
import type { Customer } from '../types'
import type { TableQueries } from '@/@types/common'

// =========================
// TEXT TRUNCATE
// =========================
const EllipsisCell = ({
    value,
    maxWidth = '180px',
}: {
    value: string
    maxWidth?: string
}) => {
    if (!value) return <span>-</span>

    return (
        <Tooltip title={value}>
            <div
                className="truncate whitespace-nowrap overflow-hidden"
                style={{ maxWidth }}
            >
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
    // FILTER
    // =========================
    const filteredAndSortedList = useMemo(() => {
        const query = ((tableData.query as string) || '')
            .toLowerCase()
            .trim()

        let list = [...customerList]

        if (!query) return list

        return list.filter((customer: any) =>
            customer.name
                ?.toLowerCase()
                .includes(query) ||
            customer.code
                ?.toLowerCase()
                .includes(query) ||
            customer.description
                ?.toLowerCase()
                .includes(query) ||
            customer.place
                ?.toLowerCase()
                .includes(query) ||
            customer.program_name
                ?.toLowerCase()
                .includes(query)
        )
    }, [customerList, tableData.query])

    // =========================
    // ACTIONS
    // =========================
    const handleViewDetails = (customer: Customer) => {
        navigate(`/programs/${customer.id}`)
    }

    const handleEdit = (customer: Customer) => {
        navigate(`/programs/edit/${customer.id}`)
    }

    // =========================
    // TABLE COLUMNS
    // =========================
    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Program Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div className="max-w-[180px] truncate font-medium">
                            {row.name}
                        </div>
                    )
                },
            },

            {
                header: 'Code',
                accessorKey: 'code',
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div className="max-w-[120px] truncate">
                            {row.code}
                        </div>
                    )
                },
            },

            {
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div
                            className="max-w-[250px] truncate"
                            title={row.description}
                        >
                            {row.description}
                        </div>
                    )
                },
            },

            {
                header: 'Start Date',
                accessorKey: 'start_date',
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div className="whitespace-nowrap">
                            {row.start_date
                                ? new Date(
                                      row.start_date,
                                  ).toLocaleString()
                                : '-'}
                        </div>
                    )
                },
            },

            {
                header: 'End Date',
                accessorKey: 'end_date',
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div className="whitespace-nowrap">
                            {row.end_date
                                ? new Date(
                                      row.end_date,
                                  ).toLocaleString()
                                : '-'}
                        </div>
                    )
                },
            },

            // {
            //     header: 'Status',
            //     accessorKey: 'is_active',
            //     cell: (props) => {
            //         const row = props.row.original

            //         return (
            //             <Tag
            //                 className={
            //                     row.is_active
            //                         ? statusColor.active
            //                         : statusColor.blocked
            //                 }
            //             >
            //                 {row.is_active ? 'Active' : 'Inactive'}
            //             </Tag>
            //         )
            //     },
            // },

            {
                           header: 'Action',
                           id: 'action',
                           cell: (props) => (
                               <div className="flex items-center gap-3">
                                   <Tooltip title="Edit">
                                       <div
                                           className="text-xl cursor-pointer font-semibold"
                                           role="button"
                                           onClick={() =>
                                               handleEdit(props.row.original)
                                           }
                                       >
                                           <TbPencil />
                                       </div>
                                   </Tooltip>
           
                                   <Tooltip title="View">
                                       <div
                                           className="text-xl cursor-pointer font-semibold"
                                           role="button"
                                           onClick={() =>
                                               handleViewDetails(
                                                   props.row.original
                                               )
                                           }
                                       >
                                           <TbEye />
                                       </div>
                                   </Tooltip>
                               </div>
                           ),
                       },
        ],
        [],
    )

    // =========================
    // TABLE FUNCTIONS
    // =========================
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

    const handleRowSelect = (
        checked: boolean,
        row: Customer
    ) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (
        checked: boolean,
        rows: Row<Customer>[]
    ) => {
        if (checked) {
            const originalRows = rows.map(
                (row) => row.original
            )

            setSelectAllCustomer(originalRows)
        } else {
            setSelectAllCustomer([])
        }
    }

    return (
        <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    Total programs: {customerListTotal}
                </h3>

                <CustomerListActionTools />
            </div>

            {/* TABLE */}
            <DataTable
                selectable
                columns={columns}
                data={filteredAndSortedList}
                noData={
                    !isLoading &&
                    filteredAndSortedList.length === 0
                }
                loading={isLoading}
                pagingData={{
                    total: customerListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedCustomer.some(
                        (selected) =>
                            selected.id === row.id
                    )
                }
                onPaginationChange={
                    handlePaginationChange
                }
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={
                    handleAllRowSelect
                }
            />
        </>
    )
}

export default CustomerListTable