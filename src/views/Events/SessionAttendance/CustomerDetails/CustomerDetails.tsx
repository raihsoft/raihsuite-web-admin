import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiUpdateSessionAttendanceDetails } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { TbArrowNarrowLeft } from 'react-icons/tb'

const CustomerDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, isLoading, error } = useSWR(
        id ? ['/events/session-attendance/', id] : null,
        () => apiUpdateSessionAttendanceDetails(id!, {}),
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
                <p className="text-gray-500 text-lg">
                    No session attendance found.
                </p>
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

            <Card className="p-10 max-w-5xl mx-auto rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">
                    Session Attendance Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Detail
                        label="Session"
                        value={data.session_title ?? '—'}
                    />
                    <Detail
                        label="Participant Name"
                        value={data.participant_name ?? '—'}
                    />
                </div>
            </Card>
        </div>
    )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-50 p-6 rounded-xl border">
        <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">
            {label}
        </div>
        <div className="text-2xl font-semibold text-gray-900">
            {value}
        </div>
    </div>
)

export default CustomerDetails
