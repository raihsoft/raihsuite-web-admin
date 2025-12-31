import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useEventsList from './hooks/useEventsList'
import { CSVLink } from 'react-csv'

const EventsActionTools = () => {
    const navigate = useNavigate()
    const { eventsList } = useEventsList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="events.csv"
                data={eventsList}
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
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate('/events/create')}
            >
                Add new
            </Button>
        </div>
    )
}

export default EventsActionTools
