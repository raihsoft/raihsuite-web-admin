import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { PiUserDuotone, PiSignOutDuotone } from 'react-icons/pi'
import { TbPasswordUser } from "react-icons/tb";
import { useAuth } from '@/auth'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    apiGetTenantMemberships,
    apiGetTenantById,
} from '@/services/CustomersService'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

// You can add extra dropdown items here
const dropdownItemList: DropdownList[] = []

const _UserDropdown = () => {
    const { avatar, email } = useSessionUser((state) => state.user)
    const { signOut } = useAuth()

    const [tenants, setTenants] = useState<any[]>([])
    const [tenantLoading, setTenantLoading] = useState(false)

    const handleSignOut = () => {
        signOut()
    }

    const avatarProps = {
        ...(avatar ? { src: avatar } : { icon: <PiUserDuotone /> }),
    }

    useEffect(() => {
        let mounted = true

        const fetchTenants = async () => {
            setTenantLoading(true)
            try {
                // 1️⃣ Get memberships
                const membershipRes = await apiGetTenantMemberships<any, any>()
                const memberships = Array.isArray(membershipRes)
                    ? membershipRes
                    : membershipRes?.results ?? membershipRes?.list ?? []

                // 2️⃣ Find only current membership
                const currentMembership = memberships.find((m: any) => m.is_current)

                if (currentMembership) {
                    // 3️⃣ Fetch tenant details
                    const tenantRes = await apiGetTenantById<any>(currentMembership.tenant)

                    const tenantData = {
                        id: tenantRes.id,
                        name: tenantRes.name,
                        role: currentMembership.role,
                        is_current: currentMembership.is_current,
                    }

                    if (mounted) setTenants([tenantData])
                } else {
                    if (mounted) setTenants([])
                }
            } catch (error) {
                console.error('Failed fetching tenants:', error)
                toast.push(
                    <Notification type="danger">Failed to load tenants</Notification>,
                    { placement: 'top-center' }
                )
            } finally {
                if (mounted) setTenantLoading(false)
            }
        }

        fetchTenants()

        return () => {
            mounted = false
        }
    }, [])

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            {/* USER INFO */}
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>

            {/* CURRENT TENANT */}
            <Dropdown.Item variant="header">
                <div className="px-3 pt-1 pb-2">
                    {tenantLoading ? (
                        <div className="text-xs text-gray-500 mt-1">
                            Loading tenant...
                        </div>
                    ) : tenants.length === 0 ? (
                        <div className="text-xs text-gray-500 mt-1">
                            No tenant found
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 mt-2">
                            <div className="text-sm font-medium">{tenants[0].name}</div>
                            <div className="text-xs text-gray-500">{tenants[0].role}</div>
                        </div>
                    )}
                </div>
            </Dropdown.Item>

            <Dropdown.Item variant="divider" />

            {dropdownItemList.map((item) => (
                <Dropdown.Item key={item.label} eventKey={item.label} className="px-0">
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}

            <Dropdown.Item eventKey="changePassword" className="px-0">
                <Link className="flex h-full w-full px-2" to="/change-password">
                    <span className="flex gap-2 items-center w-full">
                        <span className="text-xl">
                            <TbPasswordUser />
                        </span>
                        <span>Change Password</span>
                    </span>
                </Link>
            </Dropdown.Item>

            <Dropdown.Item eventKey="signOut" className="gap-2" onClick={handleSignOut}>
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
