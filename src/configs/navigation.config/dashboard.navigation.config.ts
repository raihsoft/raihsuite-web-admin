import type { NavigationTree } from '@/@types/navigation'

const dashboardNavigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        translateKey: 'nav.dashboard',
        type: 'item',
        authority: [],
        subMenu: [],
    },
]

export default dashboardNavigationConfig
