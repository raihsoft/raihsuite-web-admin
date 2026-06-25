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

const ParticipantsTable = ({ eventId }: { eventId?: string }) => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setSelectAllCustomer,
        selectedCustomer,
        setTableData,
    } = useCustomerList(eventId) // 👈 IMPORTANT FIX

    const data = useMemo(() => customerList, [customerList])

    const handleEdit = (row: Customer) => {
        if (eventId) {
            navigate(`/participants/edit/${row.id}?eventId=${eventId}&returnTo=${encodeURIComponent(`/events/${eventId}`)}`)
        } else {
            navigate(`/participants/edit/${row.id}`)
        }
    }

    const handleView = (row: Customer) => {
        navigate(`/participants/${row.id}`)
    }

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
                    <span className="font-semibold">
                        {props.row.original.event_title}
                    </span>
                ),
            },

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
        []
    )

    return (
        <CommonTable
            data={data}
            total={customerListTotal}
            loading={isLoading}
            tableData={tableData}
            setTableData={setTableData}
            selectedItems={selectedCustomer}
            setSelectedItems={setSelectAllCustomer}
            columns={columns}
            selectable
        />
    )
}

export default ParticipantsTable