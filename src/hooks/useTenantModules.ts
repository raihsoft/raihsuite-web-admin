import useSWR from 'swr'
import { apiGetTenantModules } from '@/services/ModuleService'

/**
 * Hook that fetches the tenant modules and provides a helper
 * to check whether a given module_code is enabled.
 */
export default function useTenantModules() {
    const { data, error, isLoading } = useSWR(
        '/module-management/tenant-modules/',
        () => apiGetTenantModules(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    // Normalise: API may return an array directly or { results: [...] }
    const modules = Array.isArray(data)
        ? data
        : data && Array.isArray((data as any).results)
          ? (data as any).results
          : []

    const enabledCodes = new Set(
        modules
            .filter((m: any) => m?.is_enabled)
            .map((m: any) => String(m.module_code).trim().toLowerCase()),
    )

    /** Returns true when the given module_code (case-insensitive) is enabled */
    const isModuleEnabled = (code: string) =>
        enabledCodes.has(code.trim().toLowerCase())

    return { modules, enabledCodes, isModuleEnabled, isLoading, error }
}
