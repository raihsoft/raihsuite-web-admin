import { useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'

import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import useSWR from 'swr'
import { apiGetProgramparticipantList, apiDeleteProgram } from '@/services/CustomersService'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
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

// =========================
// PARTICIPANT COUNT CELL
// =========================
const ParticipantCountCell = ({
    programId,
    initialCount,
}: {
    programId: string | number
    initialCount?: number
}) => {
    if (initialCount !== undefined) {
        return (
            <span className="font-semibold text-gray-700 dark:text-gray-300">
                {initialCount}
            </span>
        )
    }

    const { data: allParticipantsData, isLoading } = useSWR<any>(
        ['/programs/participants/all-count'],
        null,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

    if (isLoading && !allParticipantsData) {
        return <span className="animate-pulse text-gray-400">Loading...</span>
    }

    const allParticipants = allParticipantsData?.results ?? []
    const count = allParticipants.filter((p: any) => {
        const pProgId = p.program && typeof p.program === 'object'
            ? p.program.id
            : (p.program || p.program_id)
        return String(pProgId) === String(programId)
    }).length

    return (
        <span className="font-semibold text-gray-700 dark:text-gray-300">
            {count}
        </span>
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
        mutate,
    } = useCustomerList()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState<Customer | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = (customer: Customer) => {
        setSelectedProgram(customer)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedProgram) return
        setIsDeleting(true)
        try {
            await apiDeleteProgram(String(selectedProgram.id))
            toast.push(
                <Notification type="success">
                    Program deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )
            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete program.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setSelectedProgram(null)
        }
    }

    // Fetch all participants globally to support correct client-side grouping and counting
    useSWR(
        ['/programs/participants/all-count'],
        () => apiGetProgramparticipantList<any, any>({ limit: 1000 }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

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

            {
                header: 'Participants',
                id: 'participants',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <ParticipantCountCell
                            programId={row.id}
                            initialCount={
                                row.participants_count ??
                                row.participant_count ??
                                (Array.isArray(row.participants)
                                    ? row.participants.length
                                    : undefined)
                            }
                        />
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

                        <Tooltip title="Delete">
                            <div
                                className="text-xl cursor-pointer font-semibold text-red-500 hover:text-red-700"
                                role="button"
                                onClick={() =>
                                    handleDeleteClick(props.row.original)
                                }
                            >
                                <TbTrash />
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
            {/* =========================
            HEADER
        ========================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

                {/* SHOWING ENTRIES */}
                <div className="text-sm text-gray-500">
                    Showing{' '}
                    {customerListTotal === 0
                        ? 0
                        : ((tableData.pageIndex as number) - 1) *
                        (tableData.pageSize as number) +
                        1}{' '}
                    to{' '}
                    {Math.min(
                        (tableData.pageIndex as number) *
                        (tableData.pageSize as number),
                        customerListTotal
                    )}{' '}
                    of {customerListTotal} entries
                </div>

            </div>

            {/* =========================
            TABLE
        ========================= */}
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
                    pageIndex:
                        tableData.pageIndex as number,
                    pageSize:
                        tableData.pageSize as number,
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
                onSelectChange={
                    handleSelectChange
                }
                onSort={handleSort}
                onCheckBoxChange={
                    handleRowSelect
                }
                onIndeterminateCheckBoxChange={
                    handleAllRowSelect
                }
            />

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                type="danger"
                title={selectedProgram ? `Delete "${selectedProgram.name}"` : 'Delete Program'}
                onClose={() => { setDeleteDialogOpen(false); setSelectedProgram(null); }}
                onRequestClose={() => { setDeleteDialogOpen(false); setSelectedProgram(null); }}
                onCancel={() => { setDeleteDialogOpen(false); setSelectedProgram(null); }}
                onConfirm={handleDeleteConfirm}
                confirmButtonProps={{ loading: isDeleting }}
            >
                <p>
                    Are you sure you want to delete "{selectedProgram?.name}"?
                    This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListTable