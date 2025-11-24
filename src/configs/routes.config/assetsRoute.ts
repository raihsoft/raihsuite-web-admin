import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import { HRM_EMPLOYEES_EDIT_PREFIX_PATH, HRM_EEMPLOYEES_PREFIX_PATH, HRM_EMPLOYEES_DEATILS_PREFIX_PATH, ASSET_PREFIX_PATH, ASSET_EDIT_PREFIX_PATH, ASSET_DEATILS_PREFIX_PATH } from "@/constants/route.constant"

const assetsRoute: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_PREFIX_PATH}/assets-create`,   // /employees/employee-create
        component: lazy(() => import("@/views/ASSETS/asset/CustomerCreate")),
        authority: [ADMIN, USER],
    },
    {
        key: "employeeEdit",
        path: `${ASSET_EDIT_PREFIX_PATH}/:id`,           // /employee-edit/:id
        component: lazy(() => import("@/views/ASSETS/asset/CustomerEdit")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Edit Asset",
                description: "Manage employee details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: "employeeDeatails",
        path: `${ASSET_DEATILS_PREFIX_PATH}/:id`,
        component: lazy(() => import("@/views/ASSETS/asset/CustomerDetails")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Asset Details ",
                description: "Manage employee details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },
]

export default assetsRoute
