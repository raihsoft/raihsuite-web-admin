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
                title: 'Create Session Attendance',
                description: 'Create a new Session Attendance.',
                contained: true,
            },
            footer: false,
        },
    },
    {
            key: 'sessionattendanceEdit',
            path: '/session-attendance/edit/:id',
            component: lazy(() => import('@/views/Events/SessionAttendance/CustomerEdit')),
            authority: [],
            meta: {
                header: {
                    title: 'Edit Session Attendance',
                    description: 'Edit Session Attendance information.',
                    contained: true,
                },
                footer: false,
            },
        },
            {
                key: 'session-attendanceDetails',
                path: '/session-attendance/:id',
                component: lazy(() => import('@/views/Events/SessionAttendance/CustomerDetails')),
                authority: [],
                meta: {
                    header: {
                        title: 'session Attendance Details',
                        description: 'View Session Attendance details.',
                        contained: true,
                    },
                    footer: false,
                },
            },


]

export default SessionAttendanceRoute



