import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import employeeRoute from './employeeRoute'
import orderRoute from './orderRoute'
import organizationRoute from './organizationRoute'
import zoneRoute from './zoneRoute'


export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
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
    {
        key: 'contentasset',
        path: '/contentasset',
        component: lazy(() => import('@/views/contentasset/ContentAssetList')),
        authority: [],
    },
    // {
    //     key: 'contact',
    //     path: '/contact',
    //     component: lazy(() => import('@/views/CRM/contacts/ContactList')),
    //     authority: [],
    // },
    {
        key: 'enquiries',
        path: '/enquiries',
        component: lazy(() => import('@/views/CRM/enquiries/EnquiriesList')),
        authority: [],
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

    
    

    ...othersRoute,...employeeRoute,...orderRoute,...organizationRoute,...zoneRoute
]

