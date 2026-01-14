import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import EventsTable from './EventsTable'
import EventsActionTools from './EventsActionTools'
import EventsTableTools from './EventsTableTools'
import CustomerListSelected from '../CustomerList/components/CustomerListSelected'

const EventsOverview = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Events</h3>
                            <div className="flex items-center gap-2">
                                <EventsActionTools />
                            </div>
                        </div>

                        <EventsTableTools />
                        <EventsTable />
                        
                    </div>
                </AdaptiveCard>
                 
            </Container>
            <CustomerListSelected />
        </>
    )
}

export default EventsOverview
