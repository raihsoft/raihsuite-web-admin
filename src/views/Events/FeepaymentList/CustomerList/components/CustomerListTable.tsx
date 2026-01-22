import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import { TbEye } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import useCustomerList from '../hooks/useCustomerList' // hook fetching fee payments
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'

type FeePayment = {
  id: string
  participant_name: string
  fee_amount: number
  payment_type: string
  date: string
  status: string
}

const ActionColumn = ({ onView }: { onView: () => void }) => (
  <div className="flex items-center gap-3">
    <Tooltip title="View">
      <span
        className="cursor-pointer text-xl"
        onClick={onView} // simple click, no preventDefault
      >
        <TbEye />
      </span>
    </Tooltip>
  </div>
)

const FeePaymentListTable = () => {
  const navigate = useNavigate()
  const { customerList, customerListTotal, tableData, isLoading, setTableData } = useCustomerList()

  const columns: ColumnDef<FeePayment>[] = useMemo(
    () => [
      {
        header: 'Participant Name',
        accessorKey: 'participant_name',
        cell: (props) => (
          <span
            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-700"
            onClick={() => props.row.original.id && navigate(`/feepayment/details/${props.row.original.id}`)}
          >
            {props.row.original.participant_name}
          </span>
        ),
      },
      {
        header: 'Fee Amount',
        accessorKey: 'fee_amount',
        cell: (props) => <span className="text-green-600 font-semibold">₹{props.row.original.fee_amount}</span>,
      },
      {
        header: 'Payment Type',
        accessorKey: 'payment_type',
        cell: (props) => <Tag className="bg-yellow-200 text-gray-900">{props.row.original.payment_type}</Tag>,
      },
    
      {
        header: 'Action',
        id: 'action',
        cell: (props) => (
          <ActionColumn
            onView={() => props.row.original.id && navigate(`/feepayment/details/${props.row.original.id}`)}
          />
        ),
      },
    ],
    [navigate]
  )

  const handlePaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.pageIndex = page
    setTableData(newTableData)
  }

  const handleSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.pageSize = Number(value)
    newTableData.pageIndex = 1
    setTableData(newTableData)
  }

  const handleSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData)
    newTableData.sort = sort
    setTableData(newTableData)
  }

  return (
    <DataTable
      columns={columns}
      data={customerList as FeePayment[]}
      loading={isLoading}
      noData={!isLoading && customerList.length === 0}
      pagingData={{
        total: customerListTotal,
        pageIndex: tableData.pageIndex as number,
        pageSize: tableData.pageSize as number,
      }}
      onPaginationChange={handlePaginationChange}
      onSelectChange={handleSelectChange}
      onSort={handleSort}
    />
  )
}

export default FeePaymentListTable
