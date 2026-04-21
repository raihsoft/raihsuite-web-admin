import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import { Link, useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import type { TableQueries } from '@/@types/common'

const truncateText = (text: string, maxLength = 40) => {
    if (!text) return ''
    return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text
}

const NameColumn = ({ row, searchQuery }: { row: Customer; searchQuery?: string }) => {
    const highlightMatch = (text: string, query?: string) => {
        if (!query || query.length === 0) return text
        
        const regex = new RegExp(`(${query})`, 'gi')
        const parts = text.split(regex)
        
        return parts.map((part, i) => 
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-300 font-bold">{part}</mark>
            ) : (
                part
            )
        )
    }
    
    return (
        <Link
            className="hover:text-primary font-semibold text-gray-900 dark:text-gray-100"
            to={`/concepts/customers/customer-details/${row.id}`}
        >
            {highlightMatch(row.name, searchQuery)}
        </Link>
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
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()

    // ✅ Latest first sorting + search filter
    const filteredAndSortedList = useMemo(() => {
        let list = [...customerList]

        // Latest first (based on created_at)
        list.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        const query = (tableData.query as string || '').toLowerCase().trim()

        if (!query) return list

        return list.filter(customer =>
            customer.name.toLowerCase().includes(query)
        )
    }, [customerList, tableData.query])

    const handleViewDetails = (customer: Customer) => {
        navigate(`/enquiries/${customer.id}`)
    }

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                // cell: (props) => (
                //     <NameColumn
                //         row={props.row.original}
                //         searchQuery={tableData.query as string}
                //     />
                // ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
            },
            {
                header: 'Date',
                accessorKey: 'created_at',
            },
            {
                header: 'Message',
                accessorKey: 'message',
                cell: (props) => (
                    <Tooltip title={props.row.original.message}>
                        <span>
                            {truncateText(props.row.original.message, 20)}
                        </span>
                    </Tooltip>
                ),
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <div className="flex items-center gap-3">
                        <Tooltip title="View">
                            <div
                                className="text-xl cursor-pointer font-semibold"
                                role="button"
                                onClick={() => handleViewDetails(props.row.original)}
                            >
                                <TbEye />
                            </div>
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [tableData.query],
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

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Customer) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCustomer(originalRows)
        } else {
            setSelectAllCustomer([])
        }
    }

    return (
        <>
            {/* ✅ Total + Showing Count */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    Total Enquiries: {customerListTotal}
                </h3>

                {/* <span className="text-sm text-gray-500">
                    Showing: {filteredAndSortedList.length}
                </span> */}
            </div>

            <DataTable
                selectable
                columns={columns}
                data={filteredAndSortedList}
                noData={!isLoading && filteredAndSortedList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: customerListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedCustomer.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
        </>
    )
}

export default CustomerListTable
