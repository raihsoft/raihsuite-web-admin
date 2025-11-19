import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import {  ASSET_TYPE_CATEGORIES_PREFIX_PATH, ASSET_PREFIX_PATH } from "@/constants/route.constant"

const assetTypeCategories: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_TYPE_CATEGORIES_PREFIX_PATH}/asset-type-categories-create`,   
        component: lazy(() => import("@/views/assets/asset_type_categories/CustomerCreate")),
        authority: [ADMIN, USER],
    },
]

export default assetTypeCategories
