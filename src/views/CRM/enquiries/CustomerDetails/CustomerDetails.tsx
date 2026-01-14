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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, idParam]) => apiGetEnquiryById<any>(idParam as string),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container>
                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:underline"
                        onClick={handleBack}
                    >
                        <TbArrowNarrowLeft className="text-lg" />
                        Back
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    <h3 className="text-3xl font-semibold mb-4">Enquiry Details</h3>

                    {data && !isEmpty(data) ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left column - summary */}
                            <div className="lg:col-span-1">
                                <Card className="h-full">
                                    <div className="p-6">
                                        <h4 className="text-2xl font-semibold mb-2">{data.name}</h4>
                                        {data.email && (
                                            <div className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300 mb-2">
                                                <FaEnvelope className="text-base text-gray-500" />
                                                <a href={`mailto:${data.email}`} className="hover:underline break-all">{data.email}</a>
                                            </div>
                                        )}
                                        {data.phone && (
                                            <div className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300">
                                                <FaPhone className="text-base text-gray-500" />
                                                <a href={`tel:${data.phone}`} className="hover:underline">{data.phone}</a>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            {/* Right column - message and extra details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold mb-3">Message</h4>
                                        <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{data.message || '—'}</p>
                                    </div>
                                </Card>

                                {/* Additional fields if present */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.subject && (
                                        <Card>
                                            <div className="p-4">
                                                        <h5 className="text-base font-medium text-gray-600">Subject</h5>
                                                        <p className="text-base text-gray-900 dark:text-gray-100">{data.subject}</p>
                                                    </div>
                                        </Card>
                                    )}
                                    {data.created_at && (
                                        <Card>
                                            <div className="p-4">
                                                    <h5 className="text-base font-medium text-gray-600">Submitted</h5>
                                                    <p className="text-base text-gray-900 dark:text-gray-100">{new Date(data.created_at).toLocaleString()}</p>
                                                </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-gray-600">No data found.</p>
                    )}
                </div>
            </Container>
        </Loading>
    )
}

export default CustomerDetails
