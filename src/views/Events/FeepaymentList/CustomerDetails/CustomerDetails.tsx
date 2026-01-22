import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { apiGetFeePaymentDetails } from '@/services/CustomersService'

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

  const { data, isLoading, error } = useSWR<FeePayment>(
    id ? `/events/fee-payments/${id}` : null,
    () => apiGetFeePaymentDetails(id!),
    { revalidateOnFocus: false }
  )

  if (isLoading) return <Loading loading />

  if (error || !data) {
    return <div className="text-center text-gray-500 mt-12">Fee Payment not found.</div>
  }

  const payment = data

  return (
    <div className="p-6 ">
      <Card className="p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4">{payment.participant_name}</h2>

        <Card className="p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-6">Fee Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="Participant Name" value={payment.participant_name} />
            <Detail label="Fee Amount" value={`₹${payment.fee_amount}`} />
            <Detail label="Payment Type" value={payment.payment_type} />
            <Detail label="Paid At" value={new Date(payment.paid_at).toLocaleString()} />
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
