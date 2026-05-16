import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const ProgramsparticipantRoute: Routes = [
    {
        key: 'programs.participantList',
        path: '/participants-programs',
        component: lazy(() => import('@/views/Programs/participants/ParticipantList')),
        authority: [],
    },
    {
        key: 'programs.participantCreate',
        path: '/program-participants/create',
        component: lazy(() => import('@/views/Programs/participants/CustomerCreate')),
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
        key: 'programs.participantDetails',
        path: '/program-participants/:id',
        component: lazy(() => import('@/views/Programs/participants/CustomerDetails')),
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
        key: 'programs.participantEdit',
        path: '/program-participants/edit/:id',
        component: lazy(() => import('@/views/Programs/participants/CustomerEdit')),
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

export default ProgramsparticipantRoute



