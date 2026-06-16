import navigationConfig from '.'
import type { NavigationTree } from '@/@types/navigation'
import { apiGetTenantModules } from '@/services/ModuleService'
import { moduleNavigationMap } from './moduleNavigationMap'

interface TenantModule {
    module_code: string
    parent_module_code?: string | null
    is_enabled: boolean
}

export const getAllowedNavigation = async (): Promise<NavigationTree[]> => {
    const tenantModules = await apiGetTenantModules()

    const modulesArray: TenantModule[] = Array.isArray(tenantModules)
        ? tenantModules
        : tenantModules && Array.isArray((tenantModules as any).results)
          ? (tenantModules as any).results
          : []

    if (!modulesArray.length) {
        return []
    }

    const enabledModules = modulesArray.filter((m) => m?.is_enabled)

    const enabledPermissionCodes = new Set(
        enabledModules.map((m) =>
            String(m.module_code).trim().toLowerCase(),
        ),
    )

    // Load navigation config using both module_code and parent_module_code
    const loaderCodes = Array.from(
        new Set(
            enabledModules.flatMap((m) => {
                const codes: string[] = []

                if (m.module_code) {
                    codes.push(
                        String(m.module_code).trim().toLowerCase(),
                    )
                }

                if (m.parent_module_code) {
                    codes.push(
                        String(m.parent_module_code)
                            .trim()
                            .toLowerCase(),
                    )
                }

                return codes
            }),
        ),
    )

    const loaders = loaderCodes
        .map((code) => moduleNavigationMap[code])
        .filter(Boolean) as Array<
        () => Promise<{ default: NavigationTree[] }>
    >

    let flattened: NavigationTree[] = []

    if (loaders.length > 0) {
        const modules = await Promise.all(
            loaders.map((loader) => loader()),
        )

        flattened = modules.flatMap((m) => m.default)
    } else {
        flattened = navigationConfig
    }

    // Remove duplicates
    const seen = new Set<string>()

    const uniqueNavigation = flattened.filter((nav) => {
        const key = nav.key.toLowerCase()

        if (seen.has(key)) {
            return false
        }

        seen.add(key)
        return true
    })

    const result: NavigationTree[] = []

    for (const nav of uniqueNavigation) {
        const filteredChildren =
            nav.subMenu?.filter((child) =>
                enabledPermissionCodes.has(
                    child.key.toLowerCase(),
                ),
            ) ?? []

        const parentEnabled = enabledPermissionCodes.has(
            nav.key.toLowerCase(),
        )

        // Parent explicitly enabled
        if (parentEnabled) {
            result.push({
                ...nav,
                subMenu: filteredChildren,
            })
            continue
        }

        // One child enabled → promote child to top-level menu
        if (filteredChildren.length === 1) {
            result.push({
                ...filteredChildren[0],
                subMenu: [],
            })
            continue
        }

        // Multiple children enabled → keep collapse menu
        if (filteredChildren.length > 1) {
            result.push({
                ...nav,
                subMenu: filteredChildren,
            })
        }
    }

    return result
}