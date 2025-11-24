import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import {  ASSET_TYPE_PREFIX_PATH, ASSET_PREFIX_PATH, ASSET_TYPE_EDIT_PREFIX_PATH } from "@/constants/route.constant"

const assettypes: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_TYPE_PREFIX_PATH}/assets-type-create`,   
        component: lazy(() => import("@/views/ASSETS/asset_types/CustomerCreate/index")),
        authority: [ADMIN, USER],
    },
    {
        key: "asset_type_categories",
        path: `${ASSET_TYPE_EDIT_PREFIX_PATH}/:id`,           // /asset_type_categories-edit/:id
        component: lazy(() => import("@/views/assets/asset_types/CustomerEdit")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Edit Asset Type Categories",
                description: "Manage asset_type_categories details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: "employeeDeatails",
        path: `${ASSET_PREFIX_PATH}/Asset-Type-Details/:id`,
        component: lazy(() => import("@/views/assets/asset_types/CustomerDetails")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Asset Type Details ",
                description: "Manage Asset Type details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },
    
]

export default assettypes
