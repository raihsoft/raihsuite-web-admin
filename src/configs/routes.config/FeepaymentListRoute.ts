import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const FeepaymentListRoute: Routes = [
    {
        key: 'Feepayment',
        path: '/Feepayment',
        component: lazy(() => import('@/views/Events/FeepaymentList/CustomerList')),
        authority: [],
    },
    {
        key: 'FeepaymentCreate',
        path: '/Feepayment/create',
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
  key: 'FeePaymentDetails',
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
        key: 'FeepaymentListEdit',
        path: '/FeepaymentList/edit/:id',
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
    },
]

export default FeepaymentListRoute



