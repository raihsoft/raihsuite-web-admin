import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import CustomerListTable from './components/CustomerListTable'
import CustomerListActionTools from './components/CustomerListActionTools'
import CustomersListTableTools from './components/CustomersListTableTools'
import CustomerListSelected from './components/CustomerListSelected'
import CustomerListSearch from './components/CustomerListSearch'
import useCustomerList from './hooks/useCustomerList'
import cloneDeep from 'lodash/cloneDeep'

const CustomerList = ({ eventId }: { eventId?: string }) => {
    const { tableData, setTableData } = useCustomerList(eventId)

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Session</h3>
                            <div className="flex items-center gap-2">
                                <CustomerListSearch onInputChange={handleInputChange} />
                                <CustomerListActionTools eventId={eventId} />
                            </div>
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
