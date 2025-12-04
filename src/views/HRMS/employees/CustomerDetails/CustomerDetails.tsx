import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import ProfileSection from './ProfileSection'
import { apiGetEmployeeById } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import type { Customer } from '../CustomerList/types'

const CustomerDetails = () => {
    const { id } = useParams()

    const { data, isLoading } = useSWR(
        id ? [`/api/hrms/employees/${id}`] : null,
        () => apiGetEmployeeById<Customer>(id as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return (
        <Loading loading={isLoading}>
            {!isEmpty(data) && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Profile Card - Takes full width on mobile, 1/3 on desktop */}
                    <div className="xl:col-span-1">
                        <ProfileSection data={data} />
                    </div>

                    {/* Additional Info Cards */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Additional Details Card */}
                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Information</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.designation && (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Designation</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{data.designation}</p>
                                            </div>
                                        )}
                                        {data.organization && (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Organization</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{data.organization}</p>
                                            </div>
                                        )}
                                        {data.email && (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Email</p>
                                                <p className="text-gray-900 dark:text-white font-medium break-all">{data.email}</p>
                                            </div>
                                        )}
                                        {data.phone && (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{data.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* About Section */}
                        {data.description && (
                            <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                <div className="p-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.description}</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </Loading>
    )
}

export default CustomerDetails
