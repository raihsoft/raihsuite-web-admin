import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const programsNavigationConfig: NavigationTree[] = [
    {
        key: 'programs',
        path: '/programs',
        title: 'Programs',
        translateKey: 'nav.programs.title',
        icon: 'programsIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            // {
            //     key: 'programs.list',
            //     path: '/programs',
            //     title: 'Programs',
            //     translateKey: 'nav.programs.item1',
            //     icon: 'MdProgram',
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: [],
            //     subMenu: [],
            // },
        
            {
                key: 'programs.participants',
                path: '/participants-programs',
                title: 'Participants',
                translateKey: 'nav.programs.participants',
                icon: 'MdEvent',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            
        ],
    },
]

export default programsNavigationConfig
