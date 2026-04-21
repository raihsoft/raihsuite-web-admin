import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetParticipant } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { TbArrowNarrowLeft } from 'react-icons/tb'

const CustomerDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, isLoading, error } = useSWR(
        id ? ['/api/events/participants', id] : null,
        () => apiGetParticipant<any>(id!),
        {
            revalidateOnFocus: false,
        },
    )

    const handleBack = () => navigate(-1)

    if (isLoading) {
        return <Loading loading />
    }

    if (error || isEmpty(data)) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <p className="text-gray-500">No participant found.</p>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-6 pb-20">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:opacity-70 transition"
                    onClick={handleBack}
                >
                    <TbArrowNarrowLeft className="text-xl" />
                    Back
                </button>
            </div>

            <Card className="h-full w-full p-8 rounded-2xl shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {data.first_name} {data.last_name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Participant ID:{' '}
                            <span className="font-medium">{id}</span>
                        </p>
                    </div>
                </div>

                {/* Information Section */}
                <Card className="p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Participant Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Detail label="First Name" value={data.first_name ?? '—'} />
                        <Detail label="Last Name" value={data.last_name ?? '—'} />
                        <Detail label="Email" value={data.email ?? '—'} />
                        <Detail
                            label="Phone"
                            value={data.phone ?? data.phone_number ?? '—'}
                        />
                        <Detail label="Place" value={data.place ?? '—'} />
                        <Detail
                            label="Referenced By"
                            value={data.referenced_by ?? data.referred_by ?? '—'}
                        />
                        <Detail
                            label="Fee Amount"
                            value={data.fee_amount ?? '—'}
                        />
                        <Detail
                            label="Event"
                            value={data.event_title ?? data.event?.title ?? '—'}
                        />
                    </div>
                </Card>
            </Card>
        </div>
    )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
    </div>
)

export default CustomerDetails
