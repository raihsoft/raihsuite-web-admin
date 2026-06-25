import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import CommonTable from '@/components/shared/CommonTable'
import useCustomerList from '../hooks/useCustomerList'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Customer } from '../types'

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
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCustomer,
        selectedCustomer,
    } = useCustomerList()

    const handleEdit = (customer: Customer) => {
        navigate(`/employee-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Customer) => {
        navigate(`/employee-details/${customer.id}`)
    }

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Organization Name',
                accessorKey: 'organization_name',
            },
            {
                header: 'Place',
                accessorKey: 'place',
            },
            {
                header: 'Zone Name',
                accessorKey: 'zone_name',
            },
            {
                header: 'action',
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    return (
        <CommonTable
            data={customerList}
            total={customerListTotal}
            loading={isLoading}
            tableData={tableData}
            setTableData={setTableData}
            selectedItems={selectedCustomer as Customer[]}
            setSelectedItems={setSelectAllCustomer}
            columns={columns}
        />
    )
}

export default CustomerListTable