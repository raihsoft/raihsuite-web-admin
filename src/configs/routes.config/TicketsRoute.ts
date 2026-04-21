import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const TicketsRoute: Routes = [
    {
        key: 'events.ticket',
        path: '/ticket',
        component: lazy(() => import('@/views/Events/Ticket/CustomerList')),
        authority: [],
    },
    {
        key: 'events.ticketCreate',
        path: '/ticket/create',
        component: lazy(() => import('@/views/Events/Ticket/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create Ticket',
                description: 'Create a new ticket.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'events.ticketDetails',
        path: '/ticket/:id',
        component: lazy(() => import('@/views/Events/Ticket/CustomerDetails')),
        authority: [],
        meta: {
            header: {
                title: 'Ticket Details',
                description: 'View ticket details and activity.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'ticketEdit',
        path: '/ticket/edit/:id',
        component: lazy(() => import('@/views/Events/Ticket/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit Ticket',
                description: 'Edit ticket information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default TicketsRoute
