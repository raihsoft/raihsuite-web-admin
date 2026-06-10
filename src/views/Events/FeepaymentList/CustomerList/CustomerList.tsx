import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import CustomerListTable from './components/CustomerListTable'
import CustomerListActionTools from './components/CustomerListActionTools'
import CustomersListTableTools from './components/CustomersListTableTools'
import CustomerListSelected from './components/CustomerListSelected'

const CustomerList = ({ eventId }: { eventId?: string }) => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>fee payment list </h3>
                            <CustomerListActionTools eventId={eventId} />
                        </div>
                        <CustomersListTableTools eventId={eventId} />
                        <CustomerListTable eventId={eventId} />
                    </div>
                </AdaptiveCard>
            </Container>
            <CustomerListSelected eventId={eventId} />
        </>
    )
}
        
export default CustomerList
