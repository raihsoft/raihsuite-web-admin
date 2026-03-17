import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useTicketList from '../hooks/useTicketList'
import { CSVLink } from 'react-csv'

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    const { ticketList } = useTicketList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="ticketList.csv"
                data={ticketList}
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
                onClick={() => navigate('/ticket/create')}
            >
                Add new
            </Button>
        </div>
    )
}

export default CustomerListActionTools
