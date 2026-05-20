import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const ProgramsRoute: Routes = [
    {
        key: 'programs.list',
        path: '/programs',
        component: lazy(() => import('@/views/Programs/programs/ProgramsList')),
        authority: [],
    },
    {
        key: 'programs.list.create',
        path: '/programs/create',
        component: lazy(() => import('@/views/Programs/programs/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create Program',
                description: 'Create a new program.',
                contained: true,
            },
            footer: false,
        },
    },
     {
        key: 'programs.list.edit',
        path: '/programs/edit/:id',
        component: lazy(() => import('@/views/Programs/programs/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit Program',
                description: 'Edit program information.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'programs.list.details',
        path: '/programs/details/:id',
        component: lazy(() => import('@/views/Programs/programs/CustomerDetails')),
        authority: [],
        meta: {
            header: {
                title: 'Program Details',
                description: 'View program details and activity.',
                contained: true,
            },
            footer: false,
        },
    },
   
]

export default ProgramsRoute