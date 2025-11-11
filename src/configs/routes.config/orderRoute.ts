import { lazy } from "react"
import type { Routes } from "@/@types/routes"   
import { ADMIN, USER } from "@/constants/roles.constant"
import { ORDER_EDIT_PREFIX_PATH, ORDER_PREFIX_PATH} from "@/constants/route.constant"

const orderRoute: Routes = [

    // {
    //     key: "employeeCreate",   
    //     path: `${ORDER_PREFIX_PATH}/order-create`,
    //     component: lazy(() => import("@/views/order/orders/CustomerCreate")),
    //     authority: [ADMIN, USER],
    // },

    {
        key: "employeeEdit",
        path: `${ORDER_EDIT_PREFIX_PATH}/:id`,           
        component: lazy(() => import("@/views/order/orders/CustomerEdit")),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: "Edit Order",
                description: "Manage employee details, profile, and preferences.",
                contained: true,
            },
            footer: false,
        },
    },


    

    
]
    
export default orderRoute