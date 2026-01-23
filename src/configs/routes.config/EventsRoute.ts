import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const EventsRoute: Routes = [
    {
        key: 'events',
        path: '/events',
        component: lazy(() => import('@/views/Events/Events/EventsOverview')),
        authority: [],
        meta: {
            header: {
                title: '',
                description: 'Events overview.',
                contained: true,
            },
        },
    },
    {
        key: 'eventCreate',
        path: '/events/create',
        component: lazy(() => import('@/views/Events/Events/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: ' Events',
                description: 'Create a new event.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'eventDetails',
        path: '/events/:id',
        component: lazy(() => import('@/views/Events/Events/CustomerDetails')),
        authority: [],
        meta: {
            header: {
                title: 'Event Details',
                description: 'View event details.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'eventEdit',
        path: '/events/edit/:id',
        component: lazy(() => import('@/views/Events/Events/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit Event',
                description: 'Edit event information.',
                contained: true,
            },
            footer: false,
        },
    },
]

export default  EventsRoute
