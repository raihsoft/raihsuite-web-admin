import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { ADMIN, USER } from '@/constants/roles.constant'
import { ASSET_PREFIX_PATH, ASSET_EDIT_PREFIX_PATH, ASSET_DETAILS_PREFIX_PATH } from '@/constants/route.constant'

const assetsRoute: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_PREFIX_PATH}/assets-create`,   // /employees/employee-create
        component: lazy(() => import("@/views/ASSETS/asset/CustomerCreate/index")),
        authority: [ADMIN, USER],
    },
    {
        key: "employeeEdit",
        path: `${ASSET_EDIT_PREFIX_PATH}/:id`,           // /employee-edit/:id
        component: lazy(() => import("@/views/ASSETS/asset/CustomerEdit/index")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit Asset',
                description: 'Manage asset details, files and metadata.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: "employeeDeatails",
        path: `${ASSET_DETAILS_PREFIX_PATH}/:id`,
        component: lazy(() => import("@/views/HRMS/employees/CustomerDetails/index")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Asset Details',
                description: 'View asset details and related information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default assetsRoute
