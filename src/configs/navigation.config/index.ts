import type { NavigationTree } from '@/@types/navigation'

/**
 * Dynamically import and merge all module navigation configs.
 * Any file named `*.navigation.config.ts` in this folder will be included.
 */
const modules = import.meta.glob<{ default: NavigationTree[] }>(
    './*.navigation.config.ts',
    { eager: true },
)

const navigationConfig: NavigationTree[] = Object.values(modules).flatMap(
    (m) => m.default,
)

export default navigationConfig

