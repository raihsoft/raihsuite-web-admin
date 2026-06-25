import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const eventsNavigationConfig: NavigationTree[] = [
    {
        key: 'events.list',
        path: '/events',
        title: 'Events',
        translateKey: 'nav.events.title',
        icon: 'eventsIcon',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default eventsNavigationConfig
