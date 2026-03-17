import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import useTicketList from '../hooks/useTicketList'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Ticket } from '../types'
import type { TableQueries } from '@/@types/common'

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const CustomerListTable = () => {
    const navigate = useNavigate()

    const {
        ticketList,
        ticketListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllTicket,
        setSelectedTicket,
        selectedTicket,
    } = useTicketList()

    const handleEdit = (ticket: Ticket) => {
        navigate(`/ticket/edit/${ticket.id}`)
    }

    const handleViewDetails = (ticket: Ticket) => {
        navigate(`/ticket/${ticket.id}`)
    }

    const columns: ColumnDef<Ticket>[] = useMemo(
        () => [
            {
                header: 'participant_name',
                accessorKey: 'participant_name',
            },
            {
                header: 'token',
                accessorKey: 'token',
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
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ],
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedTicket.length > 0) {
            setSelectAllTicket([])
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

    const handleRowSelect = (checked: boolean, row: Ticket) => {
        setSelectedTicket(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Ticket>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllTicket(originalRows)
        } else {
            setSelectAllTicket([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={ticketList}
            noData={!isLoading && ticketList.length === 0}
            loading={isLoading}
            pagingData={{
                total: ticketListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={(row) =>
                selectedTicket.some((selected) => selected.id === row.id)
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
