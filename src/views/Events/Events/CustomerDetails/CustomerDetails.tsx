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
        <div className="h-full w-full  p-6">
            <Card className="h-full w-full p-8 rounded-2xl shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {data.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Event Code: <span className="font-medium">{data.code}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Fee Amount: <span className="font-medium">{data.fee_amount}</span>
                        </p>
                    </div>

                   
                </div>

                {/* Content Section */}
                <Card className="p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Event Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </Card>
        </div>
    )

}

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div className="text-base text-gray-500">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
    </div>
)

export default EventDetails
