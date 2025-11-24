import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import { ASSET_TYPE_CATEGORIES_EDIT_PREFIX_PATH, HRM_EEMPLOYEES_PREFIX_PATH, HRM_EMPLOYEES_DEATILS_PREFIX_PATH } from "@/constants/route.constant"

const employeeRoute: Routes = [
    {
        key: "employeeCreate",
        path: `${HRM_EEMPLOYEES_PREFIX_PATH}/asset-type-categories-create`,   
        component: lazy(() => import("@/views/ASSETS/asset_type_categories/CustomerCreate/index")),
        authority: [ADMIN, USER],
    },
    {
        key: "employeeEdit",
        path: `${ASSET_TYPE_CATEGORIES_EDIT_PREFIX_PATH}/:id`,           // /employee-edit/:id
        component: lazy(() => import("@/views/ASSETS/asset_type_categories/CustomerEdit")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Edit Employee",
                description: "Manage employee details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: "employeeDeatails",
        path: `${HRM_EMPLOYEES_DEATILS_PREFIX_PATH}/:id`,
        component: lazy(() => import("@/views/HRMS/employees/CustomerDetails")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Employees Details ",
                description: "Manage employee details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },
]

export default employeeRoute



