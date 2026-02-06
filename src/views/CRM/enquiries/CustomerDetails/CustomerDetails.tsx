import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { FaEnvelope, FaPhone } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { apiGetEnquiryById } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/enquiries', id as string],
        ([_, idParam]) => apiGetEnquiryById<any>(idParam as string),
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

                <div className="px-6 md:px-10 pb-10 max-w-4xl mx-auto">
                

                    {data && !isEmpty(data) ? (
                        <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-8 space-y-8">

                                {/* Top Profile Section */}
                                <div className="flex flex-col md:flex-row md:items-center gap-6">


                                    {/* Name + Contact */}
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold mb-2">
                                            {data.name}
                                        </h4>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            {data.email && (
                                                <a
                                                    href={`mailto:${data.email}`}
                                                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg hover:shadow-sm transition"
                                                >
                                                    <FaEnvelope />
                                                    <span className="break-all">
                                                        {data.email}
                                                    </span>
                                                </a>
                                            )}

                                            {data.phone && (
                                                <a
                                                    href={`tel:${data.phone}`}
                                                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg hover:shadow-sm transition"
                                                >
                                                    <FaPhone />
                                                    {data.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 dark:border-gray-800" />

                                {/* Message Section */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">
                                        Message
                                    </h4>

                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                        {data.message || '—'}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 dark:border-gray-800" />

                                {/* Extra Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {data.subject && (
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                                            <h5 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                                Subject
                                            </h5>
                                            <p className="text-base font-medium">
                                                {data.subject}
                                            </p>
                                        </div>
                                    )}

                                    {data.created_at && (
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                                            <h5 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                                Submitted
                                            </h5>
                                            <p className="text-base font-medium">
                                                {new Date(data.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
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