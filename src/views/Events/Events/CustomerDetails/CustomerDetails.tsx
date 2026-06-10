import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetEvent } from '@/services/CustomersService'
import useSWR from 'swr'
import { useNavigate, useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { useState } from 'react'
import CustomerList from '@/views/Events/participate/CustomerList'
import SessionCustomerList from '@/views/Events/Session/CustomerList'
import SessionAttendanceCustomerList from '@/views/Events/SessionAttendance/CustomerList'
import FeePaymentCustomerList from '@/views/Events/FeepaymentList/CustomerList'
import TicketCustomerList from '@/views/Events/Ticket/CustomerList'


const CustomerDetails = () => {
    const [activeTab, setActiveTab] = useState('participants')
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, isLoading, error } = useSWR(
        id ? ['/events/events', id] : null,
        () => apiGetEvent<any>(id!),
        {
            revalidateOnFocus: false,
        }
    )

    const handleBack = () => navigate(-1)

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
        <div className="h-full w-full p-6">
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

            <Card className="h-full w-full p-8 rounded-2xl shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {data.title}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Event Code:{' '}
                            <span className="font-medium">
                                {data.code}
                            </span>
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Fee Amount:{' '}
                            <span className="font-medium">
                                {data.fee_amount}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Event Information */}
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


                {/* Event Management */}
<Card className="p-6 mt-6 rounded-xl border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Event Management
    </h3>

    <div className="flex flex-wrap gap-3 mb-6">
        {['participants', 'sessions', 'attendance', 'payments', 'tickets'].map((tab) => {
            const labelMap: Record<string, string> = {
                participants: 'Participants',
                sessions: 'Sessions',
                attendance: 'Attendance',
                payments: 'Fee Payments',
                tickets: 'Tickets',
            }

            return (
                <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg border transition ${
                        activeTab === tab
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab(tab)}
                >
                    {labelMap[tab]}
                </button>
            )
        })}
    </div>

    {activeTab === 'participants' && <CustomerList eventId={id} />}
    {activeTab === 'sessions' && <SessionCustomerList eventId={id} />}
    {activeTab === 'attendance' && <SessionAttendanceCustomerList eventId={id} />}
    {activeTab === 'payments' && <FeePaymentCustomerList eventId={id} />}
    {activeTab === 'tickets' && <TicketCustomerList eventId={id} />}
</Card>
            </Card>
        </div>
    )
}

const Detail = ({
    label,
    value,
}: {
    label: string
    value: string
}) => (
    <div>
        <div className="text-base text-gray-500">
            {label}
        </div>
        <div className="text-xl font-semibold text-gray-900">
            {value}
        </div>
    </div>
)

const ModuleCard = ({
    title,
    onClick,
}: {
    title: string
    onClick: () => void
}) => {
    return (
        <div
            onClick={onClick}
            className="
                cursor-pointer
                p-6
                rounded-xl
                border
                border-gray-200
                hover:border-primary
                hover:shadow-md
                transition-all
                text-center
            "
        >
            <h4 className="font-semibold text-gray-800">
                {title}
            </h4>
        </div>
    )
}

export default CustomerDetails