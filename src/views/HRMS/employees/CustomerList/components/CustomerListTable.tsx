import { useMemo, useCallback } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import CommonTable from '@/components/shared/CommonTable'
import useCustomerList from '../hooks/useCustomerList'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import { useCustomerListStore } from '../store/customerListStore'
const ActionColumn = ({ onEdit, onViewDetail }: any) => (
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

const CustomerListTable = () => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        selectedCustomer,
        setSelectAllCustomer,
        setTableData,
    } = useCustomerList()

    const data = useMemo(() => customerList, [customerList])

    // =========================
    // DEBUG + FIXED CHECKBOX STATE
    // =========================
const checkboxChecked = useCallback(
    (row: Customer) => {
        return selectedCustomer.some((s) => String(s.id) === String(row.id))
    },
    [selectedCustomer]
)

    // =========================
    // ROW SELECT
    // =========================
const handleSelectItem = useCallback(
    (items: Customer[]) => {
        // CommonTable passes full new array — just sync to store
        useCustomerListStore.setState({ selectedCustomer: items })
    },
    []
)

const handleSelectAll = useCallback(
    (items: Customer[]) => {
        useCustomerListStore.setState({ selectedCustomer: items })
    },
    []
)
    // =========================
    // TABLE COLUMNS
    // =========================
    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Designation', accessorKey: 'designation' },
            { header: 'Organization', accessorKey: 'organization' },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() =>
                            navigate(`/employee-edit/${props.row.original.id}`)
                        }
                        onViewDetail={() =>
                            navigate(`/employee-details/${props.row.original.id}`)
                        }
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
            setSelectedItems={setSelectAllCustomer}
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

export default CustomerListTable