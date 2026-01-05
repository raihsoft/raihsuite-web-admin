import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetEvents} from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

const EventDetails = () => {
    const { id } = useParams()

    const { data: resp, isLoading } = useSWR(
        ['/events/events', { code: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetEvents<any, { code: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

    // Normalize response to single event object
    const data: any =
        resp?.list?.[0] ??
        resp?.results?.[0] ??
        resp ??
        null

    return (
<Loading loading={isLoading}>
  {isEmpty(data) ? (
    <div className="h-full flex flex-col items-center justify-center">
      <p className="text-gray-500">No event found.</p>
    </div>
  ) : (
    <Card className="p-12 max-w-6xl mx-auto">
      <h3 className="text-3xl font-bold mb-8 text-black">
        Event Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Title */}
        <div>
          <div className="text-base text-gray-500">Event Title</div>
          <div className="text-xl font-semibold">{data.title ?? '—'}</div>
        </div>

        {/* Code */}
        <div>
          <div className="text-base text-gray-500">Event Code</div>
          <div className="text-xl font-semibold">{data.code ?? '—'}</div>
        </div>

        {/* Start Date */}
        <div>
          <div className="text-base text-gray-500">Start Date</div>
          <div className="text-xl font-semibold">
            {data.start_date
              ? dayjs(data.start_date).format('DD MMM YYYY, hh:mm A')
              : '—'}
          </div>
        </div>

        {/* End Date */}
        <div>
          <div className="text-base text-gray-500">End Date</div>
          <div className="text-xl font-semibold">
            {data.end_date
              ? dayjs(data.end_date).format('DD MMM YYYY, hh:mm A')
              : '—'}
          </div>
        </div>
      </div>
    </Card>
  )}
</Loading>

    )
}

export default EventDetails
