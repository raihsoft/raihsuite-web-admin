import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const crmNavigationConfig: NavigationTree[] = [
    {
        key: 'crm',
        path: '',
        title: 'CRM',
        translateKey: 'nav.crm.title',
        icon: 'contactsIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'enquiries',
                path: '/enquiries',
                title: 'Enquiries',
                translateKey: 'nav.crm.enquiries',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default crmNavigationConfig
