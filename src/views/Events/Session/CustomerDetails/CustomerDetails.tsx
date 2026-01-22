import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { apiGetSessionDetails } from '@/services/CustomersService'

type Session = {
  id: string
  tenant: number
  event: string
  title: string
  start_datetime: number
  end_datetime: number
  day: number
  speaker: string
  location: string
  event_title: string
}

const FeePaymentDetails = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useSWR<Session>(
    id ? `/events/sessions/${id}` : null,
    () => apiGetSessionDetails(id!),
    { revalidateOnFocus: false }
  )

  if (isLoading) return <Loading loading />

  if (error || !data) {
    return <div className="text-center text-gray-500 mt-12">Fee Payment not found.</div>
  }

  const payment = data

  return (
    <div className="p-6 ">
   
        <Card className="p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-6">Session Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="Event" value={payment.event_title} />
            <Detail label="Title" value={payment.title} />
            <Detail label="Start Date" value={new Date(payment.start_datetime).toLocaleString()} />
            <Detail label="End Date" value={new Date(payment.end_datetime).toLocaleString()} />
            <Detail label="Day" value={payment.day} />
            <Detail label="Speaker" value={payment.speaker} />
            <Detail label="Location" value={payment.location} />
          </div>
        </Card>
      
    </div>
  )
}

const Detail = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-lg font-semibold">{value ?? '—'}</div>
  </div>
)

export default FeePaymentDetails
