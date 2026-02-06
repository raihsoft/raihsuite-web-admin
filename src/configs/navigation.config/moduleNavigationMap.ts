import type { NavigationTree } from '@/@types/navigation'

/**
 * Build a runtime map of available module navigation loaders.
 * This prevents bundler errors when some files are missing by only
 * including existing `*.navigation.config.ts` files.
 */
const discovered = import.meta.glob<{ default: NavigationTree[] }>(
    './*.navigation.config.ts',
)

export const moduleNavigationMap: Record<
    string,
    () => Promise<{ default: NavigationTree[] }>
> = {}

// Register discovered modules by filename base (e.g. 'concepts' from './concepts.navigation.config.ts')
Object.entries(discovered).forEach(([path, loader]) => {
    const m = path.match(/\.\/([^.]+)\.navigation\.config\.ts$/)
    if (m) {
        const name = m[1]
        moduleNavigationMap[name] = loader as unknown as () => Promise<{ default: NavigationTree[] }>
    }
})

// Optional aliases (map backend module codes to different filenames)
// Only register an alias if the alias is NOT already present. This prevents
// accidentally overriding an explicit module navigation file.
const aliases: Record<string, string> = {
    // short codes from backend -> file name
    ord: 'orderform',
    evt: 'events',
    // hrms: 'concepts', // keep commented unless needed
}

Object.entries(aliases).forEach(([alias, target]) => {
    const a = alias.toLowerCase()
    const t = target.toLowerCase()
    if (!moduleNavigationMap[a] && moduleNavigationMap[t]) {
        moduleNavigationMap[a] = moduleNavigationMap[t]
        console.debug(`[moduleNavigationMap] alias '${a}' -> '${t}' registered`)
    } else if (moduleNavigationMap[a]) {
        console.debug(
            `[moduleNavigationMap] alias '${a}' skipped because explicit module exists`,
        )
    } else {
        // If desired, warn about missing target mapping
        console.warn(`Alias target '${t}' for alias '${a}' not found`)
    }
})

