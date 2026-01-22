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


]

export default SessionAttendanceRoute



