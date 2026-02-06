import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const eventsNavigationConfig: NavigationTree[] = [
    {
        key: 'events',
        path: '',
        title: 'Events',
        translateKey: 'nav.events.title',
        icon: 'eventsIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'events.list',
                path: '/events',
                title: 'Events',
                translateKey: 'nav.events.item1',
                icon: 'MdEvent',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'events.session',
                path: '/session',
                title: 'Session',
                translateKey: 'nav.events.session',
                icon: 'MdEvent',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'events.participants',
                path: '/participants',
                title: 'Participants',
                translateKey: 'nav.events.participants',
                icon: 'MdEvent',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'events.attendance',
                path: '/sessionAttendance',
                title: 'Attendance',
                translateKey: 'nav.events.attendance',
                icon: 'MdEvent',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'events.feepayment',
                path: '/feepayment',
                title: 'Fee Payment',
                translateKey: 'nav.events.feepayment',
                icon: 'MdEvent',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default eventsNavigationConfig
