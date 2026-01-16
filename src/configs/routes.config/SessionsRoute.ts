import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const SessionRoute: Routes = [
    {
        key: 'session',
        path: '/session',
        component: lazy(() => import('@/views/Events/session/CustomerList')),
        authority: [],
    },
    {
        key: 'participantCreate',
        path: '/session/create',
        component: lazy(() => import('@/views/Events/session/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create Session',
                description: 'Create a new participant.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'sessionDetails',
        path: '/participants/:id',
        component: lazy(() => import('@/views/Events/session/CustomerDetails')),
        authority: [],
        meta: {
            header: {
                title: 'Session Details',
                description: 'View session details and activity.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'sessionEdit',
        path: '/session/edit/:id',
        component: lazy(() => import('@/views/Events/participate/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit session',
                description: 'Edit session information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default SessionRoute



