import { useEffect, useState } from 'react'
import SideNav from '@/components/template/SideNav'
import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import LayoutBase from '@/components/template/LayoutBase'
import ErrorBoundary from '@/components/template/ErrorBoundary'
import useResponsive from '@/utils/hooks/useResponsive'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import {
    apiGetTenantMemberships,
} from '@/services/CustomersService'

interface Tenant {
    name: string
    role: string
}

const CollapsibleSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    const [tenants, setTenants] = useState<Tenant[]>([])
    const [tenantLoading, setTenantLoading] = useState(true)

    // ✅ Fetch tenant data
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const res = await apiGetTenantMemberships()
                setTenants((res as Tenant[]) || [])
            } catch (err) {
                console.error('Error fetching tenants:', err)
            } finally {
                setTenantLoading(false)
            }
        }

        fetchTenants()
    }, [])

    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                <ErrorBoundary>
                    {larger.lg && <SideNav />}
                </ErrorBoundary>

                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    
                    {/* ✅ HEADER */}
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={
                            <div className="flex items-center gap-2">
                                {smaller.lg && <MobileNav />}

                                <img
                                    src="/raihsuite-logo.png"
                                    alt="Logo"
                                    className="h-9 w-9 object-contain"
                                />

                                <h1
                                    className="font-bold text-2xl tracking-wide"
                                    style={{ color: "#691c81" }}
                                >
                                    Raihsuite
                                </h1>
                            </div>
                        }

                        headerEnd={
                            <div className="flex items-center gap-4">
                                
                                {/* ✅ Tenant Info */}
                                <div className="px-3 pt-1 pb-2 text-right">
                                    {tenantLoading ? (
                                        <div className="text-xs text-gray-500">
                                            Loading tenant...
                                        </div>
                                    ) : !tenants || tenants.length === 0 || !tenants[0] ? (
                                        <div className="text-xs text-gray-500">
                                            No tenant found
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                {tenants[0].name || 'Unknown Tenant'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {tenants[0].role || 'Unknown Role'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 🔥 Divider (optional but clean) */}
                                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

                                {/* ✅ User Profile */}
                                <UserProfileDropdown hoverable={false} />
                            </div>
                        }
                    />

                    {/* ✅ PAGE CONTENT */}
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSide