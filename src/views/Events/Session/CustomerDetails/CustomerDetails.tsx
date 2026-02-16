import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetSessionDetails } from '@/services/CustomersService'
import { TbArrowNarrowLeft } from 'react-icons/tb'

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
  const navigate = useNavigate()

  const { data, isLoading, error } = useSWR<Session>(
    id ? `/events/sessions/${id}` : null,
    () => apiGetSessionDetails(id!),
    { revalidateOnFocus: false }
  )

  const handleBack = () => navigate(-1)

  if (isLoading) return <Loading loading />

  if (error || !data) {
    return <div className="text-center text-gray-500 mt-12">Fee Payment not found.</div>
  }

  const payment = data

  return (
    <div className="p-6">

      {/* ✅ Back Button Added */}
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
