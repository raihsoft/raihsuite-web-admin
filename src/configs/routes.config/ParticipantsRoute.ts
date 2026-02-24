import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const participantsRoute: Routes = [
    {
        key: 'events.participants',
        path: '/participants',
        component: lazy(() => import('@/views/Events/participate/CustomerList')),
        authority: [],
    },
    {
        key: 'events.participantCreate',
        path: '/participants/create',
        component: lazy(() => import('@/views/Events/participate/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create Participant',
                description: 'Create a new participant.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'events.participantDetails',
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



