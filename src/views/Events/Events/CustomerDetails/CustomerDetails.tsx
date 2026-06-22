import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { apiGetEvent } from '@/services/CustomersService'
import useSWR from 'swr'
import { useNavigate, useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { useState, useMemo } from 'react'
import CustomerList from '@/views/Events/participate/CustomerList'
import SessionCustomerList from '@/views/Events/Session/CustomerList'
import SessionAttendanceCustomerList from '@/views/Events/SessionAttendance/CustomerList'
import FeePaymentCustomerList from '@/views/Events/FeepaymentList/CustomerList'
import TicketCustomerList from '@/views/Events/Ticket/CustomerList'
import useTenantModules from '@/hooks/useTenantModules'

/**
 * Map each tab key to the possible module_code values from the backend.
 * The tab is shown if ANY of the listed codes is enabled.
 */
const TAB_MODULE_CODES: Record<string, string[]> = {
    participants: ['events.participants', 'eventparticipants', 'event_participants', 'participants'],
    sessions:     ['events.session', 'eventsession', 'event_session', 'sessions', 'session'],
    attendance:   ['events.attendance', 'eventattendance', 'event_attendance', 'attendance', 'session_attendance', 'sessionattendance'],
    payments:     ['events.feepayment', 'eventfeepayment', 'event_fee_payment', 'fee_payments', 'feepayment', 'payments'],
    tickets:      ['events.ticket', 'events.tickets', 'eventtickets', 'event_tickets', 'tickets'],
}

const TAB_LABELS: Record<string, string> = {
    participants: 'Participants',
    sessions: 'Sessions',
    attendance: 'Attendance',
    payments: 'Fee Payments',
    tickets: 'Tickets',
}

const ALL_TABS = ['participants', 'sessions', 'attendance', 'payments', 'tickets']

const CustomerDetails = () => {
    const [activeTab, setActiveTab] = useState('')
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { isModuleEnabled, isLoading: modulesLoading } = useTenantModules()

    const { data, isLoading, error } = useSWR(
        id ? ['/events/events', id] : null,
        () => apiGetEvent<any>(id!),
        {
            revalidateOnFocus: false,
        }
    )

    // Compute which tabs are enabled based on tenant modules
    const enabledTabs = useMemo(() => {
        return ALL_TABS.filter((tab) => {
            const codes = TAB_MODULE_CODES[tab] || []
            return codes.some((code) => isModuleEnabled(code))
        })
    }, [isModuleEnabled])

    // Auto-select the first enabled tab if none is selected
    const currentTab = activeTab && enabledTabs.includes(activeTab)
        ? activeTab
        : enabledTabs[0] || ''

    const handleBack = () => navigate(-1)

    if (isLoading || modulesLoading) {
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

        <Card className="h-full w-full !bg-transparent shadow-none border-0">
            {/* Event Information */}
            <Card className="p-6 rounded-xl border border-gray-200  shadow-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Event Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Detail
                        label="Event Name"
                        value={data.title || '—'}
                    />

                    <Detail
                        label="Event Code"
                        value={data.code || '—'}
                    />

                    <Detail
                        label="Fee Amount"
                        value={data.fee_amount?.toString() || '—'}
                    />

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

            {/* Event Management — only show if at least 1 tab is enabled */}
            {enabledTabs.length > 0 && (
                <Card className="p-6 mt-6 rounded-xl border border-gray-200  shadow-none">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Event Management
                    </h3>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {enabledTabs.map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 rounded-lg border transition ${
                                    currentTab === tab
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-gray-900'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {TAB_LABELS[tab]}
                            </button>
                        ))}
                    </div>

                    {currentTab === 'participants' && (
                        <CustomerList eventId={id} />
                    )}
                    {currentTab === 'sessions' && (
                        <SessionCustomerList eventId={id} />
                    )}
                    {currentTab === 'attendance' && (
                        <SessionAttendanceCustomerList eventId={id} />
                    )}
                    {currentTab === 'payments' && (
                        <FeePaymentCustomerList eventId={id} />
                    )}
                    {currentTab === 'tickets' && (
                        <TicketCustomerList eventId={id} />
                    )}
                </Card>
            )}
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