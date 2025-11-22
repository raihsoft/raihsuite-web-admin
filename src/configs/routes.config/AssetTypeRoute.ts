import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import {  ASSET_TYPE_PREFIX_PATH, ASSET_PREFIX_PATH } from "@/constants/route.constant"

const assettypes: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_TYPE_PREFIX_PATH}/assets-type-create`,   
        component: lazy(() => import("@/views/ASSETS/asset_types/CustomerCreate/index")),
        authority: [ADMIN, USER],
    },
]

export default assettypes
