import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiUpdateSessionAttendanceDetails } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams<{ id: string }>()

    const { data, isLoading, error } = useSWR(
        id ? ['/events/session-attendance/', id] : null,
        () => apiUpdateSessionAttendanceDetails(id!, {}),
        {
            revalidateOnFocus: false,
        },
    )

    if (isLoading) {
        return <Loading loading />
    }

    if (error || isEmpty(data)) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <p className="text-gray-500">No session Attendance found.</p>
            </div>
        )
    }

    return (
        <Card className="p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-black">
                session Attendance Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Detail label="session" value={data.session ?? '—'} />
                <Detail label="participant name" value={data.participant_name ?? '—'} />
            </div>
        </Card>
    )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
    </div>
)

export default CustomerDetails
