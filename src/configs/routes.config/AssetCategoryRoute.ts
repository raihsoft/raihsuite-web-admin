import { lazy } from "react"
import type { Routes } from "@/@types/routes"
import { ADMIN, USER } from "@/constants/roles.constant"
import {  ASSET_CATEGORY_PREFIX_PATH, ASSET_PREFIX_PATH } from "@/constants/route.constant"

const assetsCategoryRoute: Routes = [
    {
        key: "employeeCreate",
        path: `${ASSET_CATEGORY_PREFIX_PATH}/assets-category-create`,   // /employees/employee-create
        component: lazy(() => import("@/views/ASSETS/asset_categories/CustomerCreate/index")),
        authority: [ADMIN, USER],
    },
    // {
    //     key: "employeeEdit",
    //     path: `${HRM_EMPLOYEES_EDIT_PREFIX_PATH}/:id`,           // /employee-edit/:id
    //     component: lazy(() => import("@/views/HRMS/employees/CustomerEdit")),
    //     authority: [ADMIN, USER],
    //     meta: {
    //         header: {
    //             title: "Edit Employee",
    //             description: "Manage employee details, profile, and preferences.",
    //             contained: true,
    //         },
    //         footer: false,
    //     },
    // },
    // {
    //     key: "employeeDeatails",
    //     path: `${HRM_EMPLOYEES_DEATILS_PREFIX_PATH}/:id`,
    //     component: lazy(() => import("@/views/HRMS/employees/CustomerDetails")),
    //     authority: [ADMIN, USER],
    //     meta: {
    //         header: {
    //             title: "Employees Details ",
    //             description: "Manage employee details, profile, and preferences.",
    //             contained: true,
    //         },
    //         footer: false,
    //     },
    // },
]

export default assetsCategoryRoute
