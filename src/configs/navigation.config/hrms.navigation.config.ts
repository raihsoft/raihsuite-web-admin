import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const hrmsNavigationConfig: NavigationTree[] = [
    {
        key: 'hrms',
        path: '',
        title: 'HRMS',
        translateKey: 'nav.hrms.title',
        icon: 'usersIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'hrms.item1',
                path: '/employees',
                title: 'Employees',
                translateKey: 'nav.hrms.employees',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default hrmsNavigationConfig
