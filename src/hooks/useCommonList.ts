import { useState, useCallback } from 'react'
import type { TableQueries } from '@/@types/common'

export interface UseCommonListProps<T> {
    initialData?: T[]
    initialTotal?: number
}

export function useCommonList<T extends Record<string, unknown>>(
    props?: UseCommonListProps<T>
) {
    const [tableData, setTableDataState] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 20,
        sort: {
            order: '',
            key: '',
        },
    })

    const [selectedItems, setSelectedItems] = useState<T[]>([])

    const setTableData = useCallback((data: TableQueries) => {
        setTableDataState(data)
        setSelectedItems([]) // clear selection on change
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setTableDataState((prev) => ({
            ...prev,
            pageIndex: page,
        }))
    }, [])

    const handlePageSizeChange = useCallback((value: number) => {
        setTableDataState((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
    }, [])

    const handleRowSelect = useCallback(
        (checked: boolean, row: T, idKey: keyof T = 'id' as keyof T) => {
            setSelectedItems((prev) => {
                if (checked) {
                    if (prev.some((i) => i[idKey] === row[idKey])) return prev
                    return [...prev, row]
                }
                return prev.filter((i) => i[idKey] !== row[idKey])
            })
        },
        []
    )

    const handleAllRowSelect = useCallback((checked: boolean, rows: T[]) => {
        setSelectedItems(checked ? rows : [])
    }, [])

    return {
        list: props?.initialData || [],
        total: props?.initialTotal || 0,

        tableData,
        setTableData,

        selectedItems,

        handlePageChange,
        handlePageSizeChange,
        handleRowSelect,
        handleAllRowSelect,

        setSelectedItems,
    }
}