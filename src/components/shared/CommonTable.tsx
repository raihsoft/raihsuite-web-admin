import { useCallback } from 'react'
import DataTable, {
    ColumnDef,
    OnSortParam,
    Row,
} from '@/components/shared/DataTable'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'

export interface CommonTableProps<T> {
    data: T[]
    total: number
    loading: boolean

    tableData: TableQueries
    setTableData: (data: TableQueries) => void

    selectedItems: T[]
    setSelectedItems: (items: T[]) => void

    columns: ColumnDef<T>[]

    rowKey?: keyof T
    selectable?: boolean
    checkboxChecked?: (row: T) => boolean
    pageSizes?: number[]
}

function CommonTable<T extends Record<string, any>>({
    data,
    total,
    loading,
    tableData,
    setTableData,
    selectedItems,
    setSelectedItems,
    columns,
    rowKey = 'id' as keyof T,
    selectable = true,
    checkboxChecked,
    pageSizes,
}: CommonTableProps<T>) {

    // =========================
    // FIX: TABLE STATE UPDATE
    // =========================
    const handleSetTableData = useCallback(
        (newData: TableQueries) => {
            setTableData(newData)

            // clear selection on pagination/sort change
            if (selectedItems.length > 0) {
                setSelectedItems([])
            }
        },
        [setTableData, selectedItems.length, setSelectedItems]
    )

    // =========================
    // Pagination
    // =========================
    const handlePaginationChange = useCallback(
        (page: number) => {
            const newTableData = cloneDeep(tableData)
            newTableData.pageIndex = page
            handleSetTableData(newTableData)
        },
        [tableData, handleSetTableData]
    )

    // =========================
    // Page size
    // =========================
    const handleSelectChange = useCallback(
        (value: number) => {
            const newTableData = cloneDeep(tableData)
            newTableData.pageSize = Number(value)
            newTableData.pageIndex = 1
            handleSetTableData(newTableData)
        },
        [tableData, handleSetTableData]
    )

    // =========================
    // Sorting
    // =========================
    const handleSort = useCallback(
        (sort: OnSortParam) => {
            const newTableData = cloneDeep(tableData)
            newTableData.sort = sort
            handleSetTableData(newTableData)
        },
        [tableData, handleSetTableData]
    )

    // =========================
    // Row Select (SAFE)
    // =========================
    const handleRowSelect = useCallback(
        (checked: boolean, row: T) => {
            if (!row || !(row as any)?.[rowKey]) return

            if (checked) {
                setSelectedItems([...selectedItems, row])
            } else {
                setSelectedItems(
                    selectedItems.filter(
                        (item) => item[rowKey] !== row[rowKey]
                    )
                )
            }
        },
        [selectedItems, setSelectedItems, rowKey]
    )

    // =========================
    // Select All (FIXED + SAFE)
    // =========================
    const handleAllRowSelect = useCallback(
        (checked: boolean, rows: Row<T>[]) => {
            if (!Array.isArray(rows)) return

            if (checked) {
                const safeRows = rows
                    .map((r) => r?.original)
                    .filter(Boolean)
                    .filter((r) => (r as any)?.[rowKey])

                setSelectedItems(safeRows)
            } else {
                setSelectedItems([])
            }
        },
        [setSelectedItems, rowKey]
    )

    // =========================
    // Checkbox checked
    // =========================
    const defaultCheckboxChecked = useCallback(
        (row: T) => {
            return selectedItems.some(
                (item) => item[rowKey] === row[rowKey]
            )
        },
        [selectedItems, rowKey]
    )

    return (
        <DataTable
            selectable={selectable}
            columns={columns}
            data={data}
            noData={!loading && data.length === 0}
            loading={loading}
            pagingData={{
                total,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            checkboxChecked={checkboxChecked || defaultCheckboxChecked}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
            pageSizes={pageSizes}
        />
    )
}

export default CommonTable