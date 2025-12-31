import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import useEventsList from './hooks/useEventsList'
import cloneDeep from 'lodash/cloneDeep'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'

type EventRow = {
    id: string
    title: string
    code?: string
    start_date?: string
    end_date?: string
}

const EventsTable = () => {
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
        if (!query || query.length === 0) return eventsList

        return eventsList.filter((item) =>
            (item.title || '').toLowerCase().includes(query) ||
            (item.code || '').toLowerCase().includes(query),
        )
    }, [eventsList, tableData.query])

    const columns: ColumnDef<EventRow>[] = useMemo(
        () => [
            { header: 'Title', accessorKey: 'title' },
            { header: 'Code', accessorKey: 'code' },
            {
                header: 'Start Date',
                accessorKey: 'start_date',
                cell: (props) => (
                    <span>{props.row.original.start_date ? new Date(props.row.original.start_date).toLocaleString() : ''}</span>
                ),
            },
            {
                header: 'End Date',
                accessorKey: 'end_date',
                cell: (props) => (
                    <span>{props.row.original.end_date ? new Date(props.row.original.end_date).toLocaleString() : ''}</span>
                ),
            },
        ],
        [],
    )

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
                selectedCustomer.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default EventsTable
