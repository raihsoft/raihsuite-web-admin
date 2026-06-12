import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const EventsRoute: Routes = [
    {
        key: 'events.list',
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
    {
    key: 'eventParticipants',
    path: '/events/:id/participants',
    component: lazy(() => import('@/views/Events/participate/CustomerList')),
    authority: [],
    meta: {
        header: {
            title: 'Participants',
            contained: true,
        },
        footer: false,
    },
},
  {
        key: 'events.session',
        path: '/session',
        component: lazy(() => import('@/views/Events/Session/CustomerList')),
        authority: [],
    },
{
        key: 'events.attendance',
        path: '/sessionAttendance',
        component: lazy(() => import('@/views/Events/SessionAttendance/CustomerList')),
        authority: [],
    },
 {
        key: 'events.feepayment',
        path: '/feepayment',
        component: lazy(() => import('@/views/Events/FeepaymentList/CustomerList')),
        authority: [],
    },
{
    key: 'eventTickets',
    path: '/events/:id/tickets',
    component: lazy(() => import('@/views/Events/Ticket/CustomerList')),
    authority: [],
},
]

export default  EventsRoute
