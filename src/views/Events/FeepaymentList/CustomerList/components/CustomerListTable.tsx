import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import { TbEye } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useCustomerList from '../hooks/useCustomerList'
import type { ColumnDef } from '@/components/shared/DataTable'

type FeePayment = {
    id: string
    participant_name: string
    fee_amount: number
    payment_type: string
}

const ActionColumn = ({ onView }: { onView: () => void }) => (
    <div className="flex items-center gap-3">
        <Tooltip title="View">
            <span className="cursor-pointer text-xl" onClick={onView}>
                <TbEye />
            </span>
        </Tooltip>
    </div>
)

const FeePaymentListTable = () => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
    } = useCustomerList()

    // =========================
    // IMPORTANT: NO FILTERING
    // =========================
    const data = useMemo(() => customerList, [customerList])

    const columns: ColumnDef<FeePayment>[] = useMemo(
        () => [
            {
                header: 'Participant Name',
                accessorKey: 'participant_name',
                cell: (props) => (
                    <span
                        className="font-semibold cursor-pointer hover:text-blue-700"
                        onClick={() =>
                            navigate(`/feepayment/details/${props.row.original.id}`)
                        }
                    >
                        {props.row.original.participant_name}
                    </span>
                ),
            },
            {
                header: 'Fee Amount',
                accessorKey: 'fee_amount',
                cell: (props) => (
                    <span className="text-green-600 font-semibold">
                        ₹{props.row.original.fee_amount}
                    </span>
                ),
            },
            {
                header: 'Payment Type',
                accessorKey: 'payment_type',
                cell: (props) => (
                    <Tag className="bg-yellow-200 text-gray-900">
                        {props.row.original.payment_type}
                    </Tag>
                ),
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() =>
                            navigate(
                                `/feepayment/details/${props.row.original.id}`,
                            )
                        }
                    />
                ),
            },
        ],
        [navigate],
    )

    // =========================
    // Pagination handlers
    // =========================
    const handleSetTableData = (data: any) => {
        setTableData(data)
    }

    const handlePaginationChange = (page: number) => {
        handleSetTableData({
            ...tableData,
            pageIndex: page,
        })
    }

    const handleSelectChange = (value: number) => {
        handleSetTableData({
            ...tableData,
            pageSize: Number(value),
            pageIndex: 1,
        })
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

export default FeePaymentListTable