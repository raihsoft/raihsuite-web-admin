import { useMemo } from 'react'
import CommonTable from '@/components/shared/CommonTable'
import useTicketList from '../hooks/useTicketList'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import type { Ticket } from '../types'

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

const TicketListTable = () => {
    const navigate = useNavigate()

    const {
        ticketList,
        ticketListTotal,
        tableData,
        isLoading,
        setTableData,
        selectedTicket,
        setSelectedTicket,
        setSelectAllTicket,
    } = useTicketList()

    // =========================
    // SAFE DATA
    // =========================
    const data = useMemo(() => ticketList, [ticketList])

    // =========================
    // Columns
    // =========================
    const columns: ColumnDef<Ticket>[] = useMemo(
        () => [
            {
                header: 'Participant',
                accessorKey: 'participant_name',
            },
            {
                header: 'Token',
                accessorKey: 'token',
            },
            {
                header: 'Event',
                accessorKey: 'event_title',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() =>
                            navigate(`/ticket/edit/${props.row.original.id}`)
                        }
                        onViewDetail={() =>
                            navigate(`/ticket/${props.row.original.id}`)
                        }
                    />
                ),
            },
        ],
        [navigate]
    )

    // =========================
    // SAFE checkbox check
    // =========================
    const checkboxChecked = (row: Ticket) => {
        if (!row?.id) return false
        return selectedTicket.some((t) => t?.id === row.id)
    }

return (
    <>
        <div className="mb-4 text-sm text-gray-500">
            Showing{' '}
            {ticketListTotal === 0
                ? 0
                : ((tableData.pageIndex as number) - 1) *
                      (tableData.pageSize as number) +
                  1}{' '}
            to{' '}
            {Math.min(
                (tableData.pageIndex as number) *
                    (tableData.pageSize as number),
                ticketListTotal
            )}{' '}
            of {ticketListTotal} entries
        </div>

        <CommonTable
            data={data}
            total={ticketListTotal}
            loading={isLoading}
            tableData={tableData}
            setTableData={setTableData}
            selectedItems={selectedTicket}
            setSelectedItems={setSelectedTicket}
            columns={columns}
            selectable={true}
            checkboxChecked={(row) =>
                selectedTicket.some(
                    (s) => s.id === row.id
                )
            }
            pageSizes={[10, 20, 50, 100]}
        />
    </>
)
}

export default TicketListTable