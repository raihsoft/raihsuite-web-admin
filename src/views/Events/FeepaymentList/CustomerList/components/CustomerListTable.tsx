import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import { TbEye } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import useCustomerList from '../hooks/useCustomerList'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'

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

   
    const filteredList = useMemo(() => {
        const query = (tableData.query as string || '').toLowerCase().trim()
        if (!query) return customerList

        return customerList.filter(
            (item) =>
                item.participant_name.toLowerCase().includes(query) ||
                item.payment_type.toLowerCase().includes(query) ||
                String(item.fee_amount).includes(query)
        )
    }, [customerList, tableData.query])

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

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
    }

    const handlePaginationChange = (page: number) => {
        const newData = cloneDeep(tableData)
        newData.pageIndex = page
        handleSetTableData(newData)
    }

    const handleSelectChange = (value: number) => {
        const newData = cloneDeep(tableData)
        newData.pageSize = Number(value)
        newData.pageIndex = 1
        handleSetTableData(newData)
    }

    return (
        <DataTable
            columns={columns}
            data={filteredList}   
            loading={isLoading}
            noData={!isLoading && filteredList.length === 0}
            pagingData={{
                total: customerListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
        />
    )
}

export default FeePaymentListTable
