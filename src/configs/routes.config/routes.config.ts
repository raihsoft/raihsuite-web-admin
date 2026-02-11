import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import employeeRoute from './employeeRoute'
import orderRoute from './orderRoute'
import organizationRoute from './organizationRoute'
import zoneRoute from './zoneRoute'
import assetsRoute from './assetsRoute'
import assetsCategoryRoute from './AssetCategoryRoute'
import assettypes from './AssetTypeRoute'
import assetTypeCategories from './AssetTypeCategoriesRoute'
import participantsRoute from './ParticipantsRoute'
import eventsRoute from './EventsRoute'
import EventsRoute from './EventsRoute'
import { s } from '@fullcalendar/core/internal-common'
import FeepaymentListRoute from './FeepaymentListRoute'
import SessionRoute from './SessionsRoute'
import SessionAttendanceRoute from './sessionAttendanceRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/dashboard')),
        authority: [],
    },
    {
        key: 'hrms.item1',
        path: '/employees',
        component: lazy(() => import('@/views/HRMS/employees/CustomerList')),
        authority: [],
    },

    {
        key: 'list',
        path: '/content-categories',
        component: lazy(() => import('@/views/contentcategories/Content-Categories-List')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'contents',
        path: '/contents',
        component: lazy(() => import('@/views/contents/ContentList')),
        authority: [],
    },
    // {
    //     key: 'contentasset',
    //     path: '/contentasset',
    //     component: lazy(() => import('@/views/contentasset/ContentAssetList')),
    //     authority: [],
    // },
    {
        key: 'contact',
        path: '/contact',
        component: lazy(() => import('@/views/CRM/contacts/ContactList')),
        authority: [],
    },
    {
        key: 'enquiries',
        path: '/enquiries',
        component: lazy(() => import('@/views/CRM/enquiries/EnquiriesList')),
        authority: [],
    },
    {
        key: 'enquiriesDetails',
        path: '/enquiries/:id',
        component: lazy(() => import('@/views/CRM/enquiries/CustomerDetails/CustomerDetails')),
        authority: [],
        meta: {
            header: {
                title: 'Enquiry Details',
                description: 'View enquiry details.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'assettypes',
        path: '/assettypes',
        component: lazy(
            () => import('@/views/ASSETS/asset_types/AssetTypeList'),
        ),
        authority: [],
    },
    {
        key: 'assets',
        path: '/assets',
        component: lazy(
            () => import('@/views/ASSETS/asset/AssetList'),
        ),
        authority: [],
    },
    {
        key: 'assetcategories',
        path: '/assetcategories',
        component: lazy(
            () => import('@/views/ASSETS/asset_categories/AssetCategoriesList'),
        ),
        authority: [],
    },
    {
        key: 'asset_type_categories',
        path: '/asset_type_categories',
        component: lazy(
            () => import('@/views/ASSETS/asset_type_categories/AssetTypeCategoriesList'),
        ),
        authority: [],
    },
    {
        key: 'orderform',
        path: '/order',
        component: lazy(
            () => import('@/views/ORDER/orders/CustomerList'),
        ),
        authority: [],
    },
    {
        key: 'Organizations',
        path: '/organization',
        component: lazy(
            () => import('@/views/ORDER/organization/CustomerList'),
        ),
        authority: [],
    },
     {
        key: 'Zones',
        path: '/zone',
        component: lazy(
            () => import('@/views/ORDER/zone/CustomerList'),
        ),
        authority: [],
    },
    {
        key: 'Delivery',
        path: '/delivery',
        component: lazy(
            () => import('@/views/ORDER/delivery/CustomerList'),
        ),
        authority: [],
    },

        {
        key: 'Delivery',
        path: '/delivery',
        component: lazy(
            () => import('@/views/ORDER/delivery/CustomerList'),
        ),
        authority: [],
    },

    
    

    {
        key: 'changePassword',
        path: '/change-password',
        component: lazy(() => import('@/views/auth/ChangePassword')),
        authority: [],
        meta: {
            header: {
                title: '',
                description: 'Change your password.',
                contained: true,
            },
            footer: false,
        },
    },

    ...othersRoute,...employeeRoute,...orderRoute,...organizationRoute,...zoneRoute,...assetsRoute,...assetsCategoryRoute,...assettypes,...assetTypeCategories,...participantsRoute,...EventsRoute,...SessionRoute,...SessionAttendanceRoute ,...FeepaymentListRoute 

]

