import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetFeePaymentDetails } from '@/services/CustomersService'
import { TbArrowNarrowLeft } from 'react-icons/tb'

type FeePayment = {
  id: string
  tenant: number
  participant: string
  fee_amount: string
  payment_type: string
  paid_at: string
  participant_name: string
}

const FeePaymentDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useSWR<FeePayment>(
    id ? `/events/fee-payments/${id}` : null,
    () => apiGetFeePaymentDetails(id!),
    { revalidateOnFocus: false }
  )

  const handleBack = () => navigate(-1)

  if (isLoading) return <Loading loading />

  if (error || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Fee Payment not found.</p>
      </div>
    )
  }

  const payment = data

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

      <Card className="p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          {payment.participant_name}
        </h2>

        <Card className="p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-6">
            Fee Payment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="Participant Name" value={payment.participant_name} />
            <Detail label="Fee Amount" value={`₹${payment.fee_amount}`} />
            <Detail label="Payment Type" value={payment.payment_type} />
            <Detail
              label="Paid At"
              value={new Date(payment.paid_at).toLocaleString()}
            />
          </div>
        </Card>
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
