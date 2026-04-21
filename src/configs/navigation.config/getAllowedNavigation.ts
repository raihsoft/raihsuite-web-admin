import navigationConfig from '.'
import type { NavigationTree } from '@/@types/navigation'
import { apiGetTenantModules } from '@/services/ModuleService'
import { moduleNavigationMap } from './moduleNavigationMap'

/**
 * Load allowed navigation based on tenant enabled modules.
 * Uses moduleNavigationMap to map backend module_code to specific navigation files.
 */
export const getAllowedNavigation = async (): Promise<NavigationTree[]> => {
    // console.debug('[getAllowedNavigation] start')

    const tenantModules = await apiGetTenantModules()

    // console.debug('[getAllowedNavigation] tenantModules:', tenantModules)

    // Normalize response: some backends return a paginated object { results: [...] }
    const modulesArray: Array<{ module_code: string; is_enabled: boolean }> = Array.isArray(
        tenantModules,
    )
        ? tenantModules
        : tenantModules && Array.isArray((tenantModules as any).results)
        ? (tenantModules as any).results
        : []

    if (!Array.isArray(modulesArray)) {
        // console.warn('[getAllowedNavigation] Unexpected tenantModules shape:', tenantModules)
    }

    // 1️⃣ Get enabled module codes (normalized to lowercase and deduped)
    const enabledModuleCodes = Array.from(
        new Set(
            (modulesArray || [])
                .filter((m) => m && m.is_enabled)
                .map((m) => String(m.module_code).trim().toLowerCase()),
        ),
    )

    // console.debug('[getAllowedNavigation] enabledModuleCodes (normalized):', enabledModuleCodes)

    if (enabledModuleCodes.length === 0) {
        // console.debug('[getAllowedNavigation] no enabled modules, returning empty array')
        return []
    }

    // 2️⃣ For enabled modules that have a mapping, import that module config
    const missingMappings = enabledModuleCodes.filter((code) => !moduleNavigationMap[code])
    if (missingMappings.length > 0) {
        // console.warn('[getAllowedNavigation] no navigation file for modules:', missingMappings)
    }

    const loaders = enabledModuleCodes
        .map((code) => moduleNavigationMap[code])
        .filter(Boolean) as Array<() => Promise<{ default: NavigationTree[] }>>

    if (loaders.length === 0) {
        // Fallback: try filtering the merged navigation config by top-level key
        const fallback = navigationConfig.filter((nav) => enabledModuleCodes.includes(nav.key))
        // console.debug('[getAllowedNavigation] loaders empty, fallback:', fallback)
        return fallback
    }

    const modules = await Promise.all(loaders.map((fn) => fn()))

    // Flatten the navigation trees from the enabled modules
    const flattened = modules.flatMap((m) => m.default)

    // Deduplicate top-level modules by `key` (keep the first occurrence)
    const seen = new Set<string>()
    const deduped: NavigationTree[] = []
    for (const nav of flattened) {
        if (!seen.has(nav.key)) {
            seen.add(nav.key)
            deduped.push(nav)
        } else {
            // console.debug('[getAllowedNavigation] duplicate top-level module skipped:', nav.key)
        }
    }

    // console.debug('[getAllowedNavigation] loaded modules deduped result:', deduped)
    return deduped
}


