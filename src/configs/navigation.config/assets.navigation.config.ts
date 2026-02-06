import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const assetsNavigationConfig: NavigationTree[] = [
    {
        key: 'assets',
        path: '',
        title: 'ASSETS',
        translateKey: 'nav.assets.title',
        icon: 'boxIcon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'assettypes',
                path: '/assettypes',
                title: 'Asset Types',
                translateKey: 'nav.assets.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'assets',
                path: '/assets',
                title: 'Assets',
                translateKey: 'nav.assets.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'assetcategories',
                path: '/assetcategories',
                title: 'Asset Categories',
                translateKey: 'nav.assets.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'asset_type_categories',
                path: '/asset_type_categories',
                title: 'Asset Type Categories',
                translateKey: 'nav.assets.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default assetsNavigationConfig
