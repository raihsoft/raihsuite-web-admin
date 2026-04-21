import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import cloneDeep from 'lodash/cloneDeep'
import useEventsList from './hooks/useEventsList'
import { useNavigate } from 'react-router-dom'
import Tooltip from '@/components/ui/Tooltip'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'

type EventRow = {
    code: string
    title: string
    start_date?: string
    end_date?: string
    fee_amount?: string | number // string from backend
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
            <div
                className="text-xl cursor-pointer select-none font-semibold"
                role="button"
                onClick={onEdit}
            >
                <TbPencil />
            </div>
        </Tooltip>
        <Tooltip title="View">
            <div
                className="text-xl cursor-pointer select-none font-semibold"
                role="button"
                onClick={onViewDetail}
            >
                <TbEye />
            </div>
        </Tooltip>
    </div>
)

const EventsTable = () => {
    const navigate = useNavigate()
    const {
        eventsList,
        eventsTotal,
        tableData,
        isLoading,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
    } = useEventsList()

    const filteredAndSortedList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()
        if (!query) return eventsList

        return eventsList.filter(
            (item) =>
                (item.title || '').toLowerCase().includes(query) ||
                (item.code || '').toLowerCase().includes(query)
        )
    }, [eventsList, tableData.query])

    const handleEdit = (event: EventRow) => {
        navigate(`/events/edit/${event.code}`)
    }

    const handleViewDetails = (event: EventRow) => {
        navigate(`/events/${event.code}`)
    }

    const columns: ColumnDef<EventRow>[] = useMemo(
        () => [
            { header: 'Title', accessorKey: 'title' },
            { header: 'Code', accessorKey: 'code' },
            {
                header: 'Fee Amount',
                accessorKey: 'fee_amount',
                cell: (props) =>
                    props.row.original.fee_amount
                        ? Number(props.row.original.fee_amount).toFixed(2)
                        : '',
            },
            {
                header: 'Start Date',
                accessorKey: 'start_date',
                cell: (props) =>
                    props.row.original.start_date
                        ? new Date(props.row.original.start_date).toLocaleString()
                        : '',
            },
            {
                header: 'End Date',
                accessorKey: 'end_date',
                cell: (props) =>
                    props.row.original.end_date
                        ? new Date(props.row.original.end_date).toLocaleString()
                        : '',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() => handleViewDetails(props.row.original)}
                    />
                ),
            },
        ],
        []
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedCustomer.length > 0) setSelectAllCustomer([])
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

    const handleRowSelect = (checked: boolean, row: EventRow) => {
        setSelectedCustomer(checked, row as any)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<EventRow>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCustomer(originalRows as any)
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
                total: eventsTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedCustomer.some((selected) => selected.code === row.code)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default EventsTable
