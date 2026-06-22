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
    apiGetTenantById,
} from '@/services/CustomersService'

interface Tenant {
    id: number
    name: string
    role: string
}

const CollapsibleSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    // ✅ use SINGLE tenant (not array)
    const [tenant, setTenant] = useState<Tenant | null>(null)
    const [tenantLoading, setTenantLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const fetchTenant = async () => {
            try {
                const response = await apiGetTenantMemberships()

                // console.log("Membership response:", response)

                const memberships = response?.results || []

                if (memberships.length > 0) {
                    const activeMembership = memberships.find(
                        (m: any) => m.is_active
                    )

                    if (activeMembership) {
                        const tenantRes = await apiGetTenantById(
                            activeMembership.tenant
                        )

                        // console.log("Tenant response:", tenantRes)

                        if (mounted) {
                            setTenant({
                                id: tenantRes.id,
                                name: tenantRes.name,
                                role: String(activeMembership.group),
                            })
                        }
                    } else {
                        if (mounted) setTenant(null)
                    }
                } else {
                    if (mounted) setTenant(null)
                }
            } catch (err) {
                // console.error('Error fetching tenant:', err)
                if (mounted) setTenant(null)
            } finally {
                if (mounted) setTenantLoading(false)
            }
        }

        fetchTenant()

        return () => {
            mounted = false
        }
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
                                    src="https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png"
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
                                    ) : tenant ? (
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                {tenant.name}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500">
                                            No tenant found
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
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
