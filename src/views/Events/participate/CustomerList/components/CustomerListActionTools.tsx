import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useCustomerList from '../hooks/useCustomerList'
import { CSVLink } from 'react-csv'

const CustomerListActionTools = ({ eventId }: { eventId?: string }) => {
    const navigate = useNavigate()

    const { customerList } = useCustomerList(eventId)

    const csvHeaders = [
        { label: 'First Name', key: 'firstName' },
        { label: 'Last Name', key: 'lastName' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Place', key: 'place' },
        { label: 'Event', key: 'event_title' },
    ]

    const downloadData = customerList.map(
        ({ fee_amount, amount_paid, balance_due, ...rest }) => rest,
    )

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="participant.csv"
                headers={csvHeaders}
                data={downloadData}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Download
                </Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() =>
                    navigate(
                        eventId
                            ? `/participants/create?eventId=${eventId}&returnTo=${encodeURIComponent(
                                  `/events/${eventId}`
                              )}`
                            : '/participants/create'
                    )
                }
            >
                Add new
            </Button>
        </div>
    )
}

export default CustomerListActionTools



