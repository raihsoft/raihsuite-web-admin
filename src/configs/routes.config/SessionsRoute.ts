import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const SessionRoute: Routes = [
    {
        key: 'session',
        path: '/session',
        component: lazy(() => import('@/views/Events/Session/CustomerList')),
        authority: [],
    },
    {
        key: 'sessionCreate',
        path: '/session/create',
        component: lazy(() => import('@/views/Events/Session/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create Session',
                description: 'Create a new Session.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'sessionDetails',
        path: '/session/:id',
        component: lazy(() => import('@/views/Events/Session/CustomerDetails')),
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
        component: lazy(() => import('@/views/Events/Session/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit Session',
                description: 'Edit session information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default SessionRoute



