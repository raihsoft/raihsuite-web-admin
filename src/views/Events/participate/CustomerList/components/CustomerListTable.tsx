import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import CommonTable from '@/components/shared/CommonTable'
import useCustomerList from '../hooks/useCustomerList'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => (
    <div className="flex items-center gap-3">
        <Tooltip title="Edit">
            <div className="text-xl cursor-pointer" onClick={onEdit}>
                <TbPencil />
            </div>
        </Tooltip>

        <Tooltip title="View">
            <div className="text-xl cursor-pointer" onClick={onViewDetail}>
                <TbEye />
            </div>
        </Tooltip>
    </div>
)

const ParticipantsTable = () => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setSelectedCustomer,
        setSelectAllCustomer,
        selectedCustomer,
        setTableData,
    } = useCustomerList()

    // =========================
    // SAFE DATA (server only)
    // =========================
    const data = useMemo(() => customerList, [customerList])

    // =========================
    // Edit / View
    // =========================
    const handleEdit = (row: Customer) => {
        navigate(`/participants/edit/${row.id}`)
    }

    const handleView = (row: Customer) => {
        navigate(`/participants/${row.id}`)
    }

    // =========================
    // SELECT ALL (SAFE)
    // =========================
    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
        if (!Array.isArray(rows)) return

        if (checked) {
            const safeRows = rows
                .map(r => r?.original)
                .filter(Boolean)
                .filter(r => r.id)

            setSelectAllCustomer(safeRows as any)
        } else {
            setSelectAllCustomer([])
        }
    }

    // =========================
    // Columns
    // =========================
    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            { header: 'First Name', accessorKey: 'firstName' },
            { header: 'Last Name', accessorKey: 'lastName' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Phone', accessorKey: 'phone' },
            { header: 'Place', accessorKey: 'place' },

            {
                header: 'Event',
                accessorKey: 'event_title',
                cell: (props) => (
                    <span
                        className="cursor-pointer font-semibold"
                        onClick={() =>
                            navigate(`/events/${props.row.original.code}`)
                        }
                    >
                        {props.row.original.event_title}
                    </span>
                ),
            },

            // {
            //     header: 'Fee',
            //     accessorKey: 'fee_amount',
            //     cell: (props) =>
            //         Number(props.row.original.fee_amount || 0).toFixed(2),
            // },

            // {
            //     header: 'Paid',
            //     accessorKey: 'amount_paid',
            //     cell: (props) =>
            //         Number(props.row.original.amount_paid || 0).toFixed(2),
            // },

            // {
            //     header: 'Balance',
            //     accessorKey: 'balance_due',
            //     cell: (props) =>
            //         Number(props.row.original.balance_due || 0).toFixed(2),
            // },

            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() => handleView(props.row.original)}
                    />
                ),
            },
        ],
        [navigate]
    )

    

return (
    <>
        <div className="mb-4 text-sm text-gray-500">
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

        <CommonTable
            data={data}
            total={customerListTotal}
            loading={isLoading}
            tableData={tableData}
            setTableData={setTableData}
            selectedItems={selectedCustomer}
            setSelectedItems={setSelectedCustomer}
            columns={columns}
            selectable={true}
            checkboxChecked={(row) =>
                selectedCustomer.some(
                    (s) => s.id === row.id
                )
            }
            pageSizes={[10, 20, 50, 100]}
        />
    </>
)


}

export default ParticipantsTable