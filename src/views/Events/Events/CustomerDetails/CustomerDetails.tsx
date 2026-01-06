import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetEvent } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

const EventDetails = () => {
    const { id } = useParams<{ id: string }>()

    const { data, isLoading, error } = useSWR(
        id ? ['/events/events', id] : null,
        () => apiGetEvent<any>(id!),
        {
            revalidateOnFocus: false,
        }
    )

    if (isLoading) {
        return <Loading loading />
    }

    if (error || isEmpty(data)) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <p className="text-gray-500">No event found.</p>
            </div>
        )
    }

    return (
        <Card className="p-12 max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-black">
                Event Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Detail label="Event Title" value={data.title ?? '—'} />
                <Detail label="Event Code" value={data.code ?? '—'} />
                <Detail
                    label="Start Date"
                    value={
                        data.start_date
                            ? dayjs(data.start_date).format(
                                  'DD MMM YYYY, hh:mm A'
                              )
                            : '—'
                    }
                />
                <Detail
                    label="End Date"
                    value={
                        data.end_date
                            ? dayjs(data.end_date).format(
                                  'DD MMM YYYY, hh:mm A'
                              )
                            : '—'
                    }
                />
            </div>
        </Card>
    )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div className="text-base text-gray-500">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
    </div>
)

export default EventDetails
