import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import { ASSET_TYPE_CATEGORIES_PREFIX_PATH } from "@/constants/route.constant"

const employeeRoute: Routes = [
    {
        key: 'assetTypeCategoryCreate',
        path: `${ASSET_TYPE_CATEGORIES_PREFIX_PATH}/create`,
        component: lazy(() => import('@/views/ASSETS/asset_type_categories/CustomerCreate/CustomerCreate')),
        authority: [ADMIN, USER],
         meta: {
            header: {
                title: '',
                description: '',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: "assetTypeCategoriesEdit",
        path: `${ASSET_TYPE_CATEGORIES_PREFIX_PATH}/:id/edit`,
        component: lazy(() => import("@/views/ASSETS/asset_type_categories/CustomerEdit")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Edit Asset Type Category",
                description: "Manage asset type category details.",
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: "assetTypeCategoriesDetails",
        path: `${ASSET_TYPE_CATEGORIES_PREFIX_PATH}/:id`,
        component: lazy(() => import('@/views/ASSETS/asset_type_categories/CustomerDetails/CustomerDetails')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Asset Type Category Details",
                description: "View asset type category details.",
                contained: true,
            },
            footer: false,
        },
    },
]

export default employeeRoute



