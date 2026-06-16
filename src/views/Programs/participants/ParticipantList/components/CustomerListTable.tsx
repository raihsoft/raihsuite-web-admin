import { useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import CustomerListActionTools from '../components/CustomerListActionTools'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiDeleteProgramparticipant } from '@/services/CustomersService'
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
        mutate,
    } = useCustomerList()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedParticipant, setSelectedParticipant] = useState<Customer | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = (customer: Customer) => {
        setSelectedParticipant(customer)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedParticipant) return
        setIsDeleting(true)
        try {
            await apiDeleteProgramparticipant(String(selectedParticipant.id))
            toast.push(
                <Notification type="success">
                    Participant deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )
            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete participant.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setSelectedParticipant(null)
        }
    }

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
            customer.participant_name
                ?.toLowerCase()
                .includes(query) ||
            customer.email
                ?.toLowerCase()
                .includes(query) ||
            customer.phone
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
        navigate(`/program-participants/details/${customer.id}`)
    }

    const handleEdit = (customer: Customer) => {
        navigate(`/program-participants/edit/${customer.id}`)
    }

    // =========================
    // TABLE COLUMNS
    // =========================
    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Program',
                accessorKey: 'program_name',
                cell: (props) => (
                    <EllipsisCell
                        value={props.row.original.program_name}
                    />
                ),
            },
            {
                header: 'Participant',
                accessorKey: 'participant_name',
                cell: (props) => (
                    <EllipsisCell
                        value={props.row.original.participant_name}
                    />
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <EllipsisCell
                        value={props.row.original.email}
                        maxWidth="220px"
                    />
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => (
                    <EllipsisCell
                        value={props.row.original.phone}
                        maxWidth="140px"
                    />
                ),
            },
            {
                header: 'Place',
                accessorKey: 'place',
                cell: (props) => (
                    <EllipsisCell
                        value={props.row.original.place}
                    />
                ),
            },
            {
                header: 'Additional Details',
                accessorKey: 'custom_data',
                cell: (props) => {
                    let customData =
                        props.row.original.custom_data

                    if (typeof customData === 'string') {
                        try {
                            customData = JSON.parse(customData)
                        } catch {
                            customData = {}
                        }
                    }

                    if (
                        !customData ||
                        Object.keys(customData).length === 0
                    ) {
                        return <span>-</span>
                    }

                    return (
                        <Tooltip
                            title={JSON.stringify(customData, null, 2)}
                        >
                            <div className="max-w-[250px] truncate">
                                {Object.entries(customData)
                                    .map(
                                        ([key, value]) =>
                                            `${key}: ${value}`,
                                    )
                                    .join(', ')}
                            </div>
                        </Tooltip>
                    )
                },
            },
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
        []
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

            {/* ACTION TOOLS */}
            <CustomerListActionTools />
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
            title={selectedParticipant ? `Delete "${selectedParticipant.participant_name || `${selectedParticipant.first_name || ''} ${selectedParticipant.last_name || ''}`.trim()}"` : 'Delete Participant'}
            onClose={() => { setDeleteDialogOpen(false); setSelectedParticipant(null); }}
            onRequestClose={() => { setDeleteDialogOpen(false); setSelectedParticipant(null); }}
            onCancel={() => { setDeleteDialogOpen(false); setSelectedParticipant(null); }}
            onConfirm={handleDeleteConfirm}
            confirmButtonProps={{ loading: isDeleting }}
        >
            <p>
                Are you sure you want to delete "{selectedParticipant ? (selectedParticipant.participant_name || `${selectedParticipant.first_name || ''} ${selectedParticipant.last_name || ''}`.trim()) : ''}"?
                This action cannot be undone.
            </p>
        </ConfirmDialog>
    </>
)
}

export default CustomerListTable