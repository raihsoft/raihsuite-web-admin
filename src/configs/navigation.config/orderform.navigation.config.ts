import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const orderformNavigationConfig: NavigationTree[] = [
    {
        key: 'orderform',
        path: '/order',
        title: 'ORDER',
        translateKey: 'nav.orderform.title',
        icon: 'orderIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'orderform.orders',
                path: '/order',
                title: 'Orders',
                translateKey: 'nav.orderform.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'orderform.zones',
                path: '/zone',
                title: 'Zones',
                translateKey: 'nav.orderform.zones',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'orderform.organizations',
                path: '/organization',
                title: 'Organizations',
                translateKey: 'nav.orderform.organizations',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'orderform.delivery',
                path: '/delivery',
                title: 'Delivery',
                translateKey: 'nav.orderform.delivery',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default orderformNavigationConfig
