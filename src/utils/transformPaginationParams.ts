import type { TableQueries } from '@/@types/common'

/**
 * Transforms frontend pagination (pageIndex/pageSize) to Django REST Framework format (limit/offset)
 * pageIndex: 1-based page number (1, 2, 3...)
 * pageSize: items per page
 *
 * Converts to:
 * limit: items per page
 * offset: starting position (0-based)
 */
export function transformPaginationParams(params: Record<string, any>): Record<string, any> {
    const transformed: Record<string, any> = {}

    // Copy all params except frontend pagination fields
    Object.keys(params || {}).forEach((key) => {
        if (key !== 'pageIndex' && key !== 'pageSize' && key !== 'total') {
            transformed[key] = params[key]
        }
    })

    const pageIndex = Number(params?.pageIndex ?? 1)
    const pageSize = Number(params?.pageSize ?? 10)

    transformed['limit'] = pageSize
    transformed['offset'] = (Math.max(1, pageIndex) - 1) * pageSize

    return transformed
}
