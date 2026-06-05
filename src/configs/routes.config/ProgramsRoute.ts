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
        path: '/programs/:id',
        component: lazy(() => import('@/views/Programs/programs/CustomerDetails')),
        authority: [],
        meta: {
            footer: false,
        },
    },
   
]

export default ProgramsRoute