import { lazy } from "react"
import type { Routes } from "@/@types/routes"   
import { ADMIN, USER } from "@/constants/roles.constant"
import {  ORGANIZATION_PREFIX_PATH} from "@/constants/route.constant"

const organizationRoute: Routes = [

    {
        key: "employeeCreate",   
        path: `${ORGANIZATION_PREFIX_PATH}/organization-create`,
        component: lazy(() => import("@/views/order/organization/CustomerCreate")),
        authority: [ADMIN, USER],
    },




    

    
]
    
export default organizationRoute