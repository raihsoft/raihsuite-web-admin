import { lazy } from 'react'
import { HRM_EMPLOYEES_DEATILS_PREFIX_PATH, HRM_EMPLOYEES_EDIT_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const conceptsRoute: Routes = [
    {
    key: 'employee.edit',
    path: `${HRM_EMPLOYEES_EDIT_PREFIX_PATH}/:id`, // not /employee-edit/employee-edit
    component: lazy(() => import('@/views/HRMS/employees/CustomerEdit')),
    authority: [ADMIN, USER],
    meta: {
        header: {
            title: 'Edit Employee',
            description: 'Manage employee details, profile, and preferences.',
            contained: true,
        },
        footer: false,
    },
}
,
    {
    key: 'employee.edit',
    path: `${HRM_EMPLOYEES_DEATILS_PREFIX_PATH}/:id`,
    component: lazy(() => import('@/views/HRMS/employees/CustomerDetails')),
    authority: [ADMIN, USER],
    meta: {
        header: {
            title: 'details Employee',
            description: 'Manage employee details, profile, and preferences.',
            contained: true,
        },
        footer: false,
    },
}

]

export default conceptsRoute
