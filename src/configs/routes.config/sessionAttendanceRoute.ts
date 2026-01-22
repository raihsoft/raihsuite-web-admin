import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const SessionAttendanceRoute: Routes = [
    {
        key: 'sessionAttendance',
        path: '/sessionAttendance',
        component: lazy(() => import('@/views/Events/SessionAttendance/CustomerList')),
        authority: [],
    },
    {
        key: 'sessionAttendance',
        path: '/sessionAttendance/create',
        component: lazy(() => import('@/views/Events/SessionAttendance/CustomerCreate')),
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

export default SessionAttendanceRoute



