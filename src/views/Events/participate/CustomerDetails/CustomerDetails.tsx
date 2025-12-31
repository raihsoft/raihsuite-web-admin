import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetEventsList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import type { Customer } from '../CustomerList/types'

const CustomerDetails = () => {
    const { id } = useParams()

    const { data: resp, isLoading } = useSWR(
        ['/api/events/participants', { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetEventsList<any, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    // Normalize response to single participant object
    const data: any = resp?.list?.[0] ?? resp?.results?.[0] ?? resp ?? null

    return (
        <Loading loading={isLoading}>
            {isEmpty(data) ? (
                <div className="h-full flex flex-col items-center justify-center">
                    <p className="text-gray-500">No participant found.</p>
                </div>
            ) : (
                <Card className="p-8 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold mb-6 text-black">Participant Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm text-gray-500">First name</div>
                            <div className="text-lg font-semibold">{data.first_name ?? data.firstName ?? data.name ?? '—'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Last name</div>
                            <div className="text-lg font-semibold">{data.last_name ?? data.lastName ?? '—'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="text-lg font-semibold">{data.email ?? '—'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Phone</div>
                            <div className="text-lg font-semibold">{data.phone ?? data.phone_number ?? '—'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Place</div>
                            <div className="text-lg font-semibold">{data.place ?? data.location ?? '—'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Referenced By</div>
                            <div className="text-lg font-semibold">{data.referenced_by ?? data.referencedBy ?? data.referred_by ?? '—'}</div>
                        </div>
                    </div>
                </Card>
            )}
        </Loading>
    )
}

export default CustomerDetails
