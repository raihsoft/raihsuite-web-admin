import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, USER } from '@/constants/roles.constant'
import { ASSET_TYPE_PREFIX_PATH, ASSET_TYPE_EDIT_PREFIX_PATH } from '@/constants/route.constant'

const assettypes: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_TYPE_PREFIX_PATH}/assets-type-create`,   
        component: lazy(() => import("@/views/ASSETS/asset_types/CustomerCreate/index")),
        authority: [ADMIN, USER],
    },
    {
        key: 'assetTypeEdit',
        path: `${ASSET_TYPE_EDIT_PREFIX_PATH}/:id`, // /assettypes-edit/:id
        component: lazy(() => import('@/views/ASSETS/asset_types/CustomerEdit')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit Asset Type',
                description: 'Manage asset type details, profile, and preferences.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'assetTypeDetails',
        path: `${ASSET_TYPE_PREFIX_PATH}/:id`, // /asset-types/:id
        component: lazy(() => import('@/views/ASSETS/asset_types/CustomerDetails')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Asset Type Details',
                description: 'View asset type details and related information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default assettypes
