import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetParticipant } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams<{ id: string }>()

    const { data, isLoading, error } = useSWR(
        id ? ['/api/events/participants', id] : null,
        () => apiGetParticipant<any>(id!),
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
                <p className="text-gray-500">No participant found.</p>
            </div>
        )
    }

    return (
        <Card className="p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-black">
                Participant Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Detail label="First name" value={data.first_name ?? '—'} />
                <Detail label="Last name" value={data.last_name ?? '—'} />
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
                    label="Event"
                    value={data.event_title ?? data.event?.title ?? '—'}
                />
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
