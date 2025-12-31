import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const participantsRoute: Routes = [
    {
        key: 'participants',
        path: '/participants',
        component: lazy(() => import('@/views/Events/participate/CustomerList')),
        authority: [],
    },
    {
        key: 'participantDetails',
        path: '/participants/:id',
        component: lazy(() => import('@/views/Events/participate/CustomerDetails')),
        authority: [],
        meta: {
            header: {
                title: 'Participant Details',
                description: 'View participant details and activity.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'participantEdit',
        path: '/participants/edit/:id',
        component: lazy(() => import('@/views/Events/participate/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit Participant',
                description: 'Edit participant information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default participantsRoute



