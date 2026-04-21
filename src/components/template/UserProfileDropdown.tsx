import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { PiUserDuotone, PiSignOutDuotone } from 'react-icons/pi'
import { TbPasswordUser } from "react-icons/tb";
import { useAuth } from '@/auth'
import { useEffect, useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    apiGetTenantMemberships,
    apiGetTenantById,
} from '@/services/CustomersService'

const _UserDropdown = () => {
    const { avatar, email } = useSessionUser((state) => state.user)
    const { signOut } = useAuth()

    // ✅ SINGLE tenant (not array)
    const [tenant, setTenant] = useState<any | null>(null)
    const [tenantLoading, setTenantLoading] = useState(false)

    const handleSignOut = () => {
        signOut()
    }

    const avatarProps = {
        ...(avatar ? { src: avatar } : { icon: <PiUserDuotone /> }),
    }

    useEffect(() => {
        let mounted = true

        const fetchTenant = async () => {
            setTenantLoading(true)

            try {
                // ✅ PAGINATED RESPONSE
                const response = await apiGetTenantMemberships<any, any>()

              

                const memberships = response?.results || []

                if (memberships.length > 0) {
                    // ✅ find active membership
                    const activeMembership = memberships.find(
                        (m: any) => m.is_active
                    )

                    if (activeMembership) {
                        // console.log("Active membership:", activeMembership)

                        // ✅ get tenant details
                        const tenantRes = await apiGetTenantById<any>(
                            activeMembership.tenant
                        )

                        // console.log("Tenant response:", tenantRes)

                        if (mounted) {
                            setTenant({
                                id: tenantRes.id,
                                name: tenantRes.name,
                                role: activeMembership.group,
                            })
                        }
                    } else {
                        if (mounted) setTenant(null)
                    }
                } else {
                    if (mounted) setTenant(null)
                }

            } catch (error) {
                // console.error(error)

                toast.push(
                    <Notification type="danger">
                        Failed to load tenant
                    </Notification>,
                    { placement: 'top-center' }
                )
            } finally {
                if (mounted) setTenantLoading(false)
            }
        }

        fetchTenant()

        return () => {
            mounted = false
        }
    }, [])

    // ✅ DEBUG (you can remove later)
    // console.log("Rendered tenant:", tenant)

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
            {/* ✅ USER INFO */}
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {email || 'No email available'}
                        </div>

                        {/* ✅ FIXED TENANT DISPLAY */}
                     
                    </div>
                </div>
            </Dropdown.Item>

            <Dropdown.Item variant="divider" />

            {/* CHANGE PASSWORD */}
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

            {/* LOGOUT */}
            <Dropdown.Item eventKey="signOut" className="gap-2" onClick={handleSignOut}>
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Logout</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown