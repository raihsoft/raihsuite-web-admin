import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const FeepaymentListRoute: Routes = [
    {
        key: 'feepayment',
        path: '/feepayment',
        component: lazy(() => import('@/views/Events/FeepaymentList/CustomerList')),
        authority: [],
    },
    {
        key: 'feepaymentCreate',
        path: '/feepayment/create',
        component: lazy(() => import('@/views/Events/FeepaymentList/CustomerCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create Fee Payment',
                description: 'Create a new fee payment.',
                contained: true,
            },
            footer: false,
        },
    },
    {
  key: 'feepaymentDetails',
  path: '/feepayment/details/:id',  // <-- must match navigate() call
  component: lazy(() => import('@/views/Events/FeepaymentList/CustomerDetails')),
  authority: [],
  meta: {
    header: {
      title: 'Fee Payment Details',
      description: 'View fee payment details and activity.',
      contained: true,
    },
    footer: false,
  },
},

    
    {
        key: 'feepaymentListEdit',
        path: '/feepayment/edit/:id',
        component: lazy(() => import('@/views/Events/FeepaymentList/CustomerEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Edit Fee Payment',
                description: 'Edit fee payment information.',
                contained: true,
            },
            footer: false,
        },
    }
]

export default FeepaymentListRoute



