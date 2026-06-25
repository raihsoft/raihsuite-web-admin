import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'

type Session = {
    id: string
    title: string
    event_title?: string
    start_datetime?: string
    end_datetime?: string
    day?: string
    speaker?: string
    location?: string
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
            <div className="cursor-pointer text-lg" onClick={onEdit}>
                <TbPencil />
            </div>
        </Tooltip>
        <Tooltip title="View">
            <div className="cursor-pointer text-lg" onClick={onViewDetail}>
                <TbEye />
            </div>
        </Tooltip>
    </div>
)

const CustomerListTable = ({ eventId }: { eventId?: string }) => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
    } = useCustomerList(eventId)


    const columns: ColumnDef<Session>[] = useMemo(() => [
        {
            header: 'Event',
            accessorKey: 'event_title',
        },
        {
            header: 'Title',
            accessorKey: 'title',
        },
        {
            header: 'Start Date',
            accessorKey: 'start_datetime',
            cell: (p) =>
                p.row.original.start_datetime
                    ? new Date(p.row.original.start_datetime).toLocaleString()
                    : '',
        },
        {
            header: 'End Date',
            accessorKey: 'end_datetime',
            cell: (p) =>
                p.row.original.end_datetime
                    ? new Date(p.row.original.end_datetime).toLocaleString()
                    : '',
        },
        {
            header: 'Day',
            accessorKey: 'day',
        },
        {
            header: 'Speaker',
            accessorKey: 'speaker',
        },
        {
            header: 'Location',
            accessorKey: 'location',
        },
        {
            header: 'Action',
            id: 'action',
            cell: (props) => (
                <ActionColumn
                    onEdit={() => {
                        if (eventId) {
                            navigate(`/session/edit/${props.row.original.id}?event=${eventId}&returnTo=${encodeURIComponent(`/events/${eventId}`)}`)
                        } else {
                            navigate(`/session/edit/${props.row.original.id}`)
                        }
                    }}
                    onViewDetail={() => navigate(`/session/${props.row.original.id}`)}
                />
            ),
        },
    ], [navigate])

    // ✅ Table state handlers
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
        newData.pageSize = value
        newData.pageIndex = 1
        handleSetTableData(newData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newData = cloneDeep(tableData)
        newData.sort = sort
        handleSetTableData(newData)
    }

    const handleRowSelect = (checked: boolean, row: Session) => {
        setSelectedCustomer(checked, row as any)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Session>[]) => {
        if (checked) {
            setSelectAllCustomer(rows.map(r => r.original) as any)
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

            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}

        />
    </>
)
}

export default CustomerListTable