import { lazy } from "react"
import type { Routes } from "@/@types/routes"   
import { ADMIN, USER } from "@/constants/roles.constant"
import {  ZONE_DEATILS_PREFIX_PATH, ZONE_EDIT_PREFIX_PATH, ZONE_PREFIX_PATH} from "@/constants/route.constant"

const zoneRoute: Routes = [

    // {
    //     key: "employeeCreate",   
    //     path: `${ZONE_PREFIX_PATH}/zone-create`,
    //     component: lazy(() => import("@/views/order/zone/CustomerCreate")),
    //     authority: [ADMIN, USER],
    // },
        // {
        //     key: "zoneEdit",
        //     path: `${ZONE_EDIT_PREFIX_PATH}/:id`,           // /employee-edit/:id
        //     component: lazy(() => import("@/views/order/zone/CustomerEdit")),
        //     authority: [ADMIN, USER],
        //     meta: {
        //         header: {
        //             title: "Edit Zone",
        //             description: "Manage zone details, profile, and preferences.",
        //             contained: true,
        //         },
        //         footer: false,
        //     },
        // },
            // {
            //     key: "employeeDeatails",
            //     path: `${ZONE_DEATILS_PREFIX_PATH}/:id`,
            //     component: lazy(() => import("@/views/order/zone/CustomerDetails")),
            //     authority: [ADMIN, USER],
            //     meta: {
            //         header: {
            //             title: "Zone Details ",
            //             description: "Manage ZONE details, profile, and preferences.",
            //             contained: true,
            //         },
            //         footer: false,
            //     },
            // },




    

    
]
    
export default zoneRoute