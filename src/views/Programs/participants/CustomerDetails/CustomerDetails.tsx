import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { apigetProgramparticipantbyid } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/programs/participants', id as string],
        ([_, idParam]) => apigetProgramparticipantbyid<any>(idParam as string, {}),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container>

                {/* Header */}
                <div className="flex items-center px-6 md:px-10 py-6">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:opacity-70 transition"
                        onClick={handleBack}
                    >
                        <TbArrowNarrowLeft className="text-xl" />
                        Back
                    </button>
                </div>

                {/* Wider Layout */}
                <div className="px-6 md:px-10 pb-10 max-w-6xl mx-auto">
                    {data && !isEmpty(data) ? (
                        <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

                            {/* Bigger spacing */}
                            <div className="p-10 space-y-8">

                                {/* Basic Info */}
                                <div className="space-y-5">

                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500 text-sm">Program</span>
                                        <span className="font-medium text-lg">
                                            {data.program_name || '—'}
                                        </span>
                                    </div>

                                    {data.participant_name && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="text-gray-500 text-sm">Participant Name</span>
                                            <span className="font-medium text-lg">
                                                {data.participant_name || '—'}
                                            </span>
                                        </div>
                                    )}



                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500 text-sm">Email</span>
                                        {data.email ? (
                                            <a
                                                href={`mailto:${data.email}`}
                                                className="font-medium text-lg hover:underline"
                                            >
                                                {data.email}
                                            </a>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </div>

                                    {/* Mobile */}
                                    {data.mobile && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="text-gray-500 text-sm">Mobile</span>
                                            <a
                                                href={`tel:${data.mobile}`}
                                                className="font-medium text-lg hover:underline"
                                            >
                                                {data.mobile}
                                            </a>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {data.phone && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="text-gray-500 text-sm">Phone</span>
                                            <a
                                                href={`tel:${data.phone}`}
                                                className="font-medium text-lg hover:underline"
                                            >
                                                {data.phone}
                                            </a>
                                        </div>
                                    )}

                                    

                                    {data.created_at && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="text-gray-500 text-sm">Submitted</span>
                                            <span className="font-medium text-lg">
                                                {new Date(data.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 dark:border-gray-800" />

                                {/* Custom Data */}
                                {data.custom_data && (
                                    <div className="space-y-5">
                                        <h4 className="text-base text-gray-500">Additional Details</h4>

                                        {data.custom_data.parent_name && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">Parent Name</span>
                                                <span className="font-medium text-lg">
                                                    {data.custom_data.name}
                                                </span>
                                            </div>
                                        )}

                                        {data.custom_data.full_address && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">Address</span>
                                                <span className="font-medium text-lg">
                                                    {data.custom_data.location_name}
                                                </span>
                                            </div>
                                        )}

                                        {data.custom_data.current_institution && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">Current Institution</span>
                                                <span className="font-medium text-lg">
                                                    {data.custom_data.organization}
                                                </span>
                                            </div>
                                        )}

                                        {data.custom_data.desired_course && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-500 text-sm">Desired Course</span>
                                                <span className="font-medium text-lg">
                                                    {data.custom_data.designation}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Message */}
                                <div>
                                    <h4 className="text-base text-gray-500 mb-3">
                                        Message
                                    </h4>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-gray-700 dark:text-gray-200 whitespace-pre-wrap text-base leading-relaxed">
                                        {data.message || '—'}
                                    </div>
                                </div>


                            </div>
                        </Card>
                    ) : (
                        <p className="text-sm opacity-70">No data found.</p>
                    )}
                </div>
            </Container>
        </Loading>
    )
}

export default CustomerDetails