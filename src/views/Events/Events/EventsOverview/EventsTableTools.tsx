import useEventsList from './hooks/useEventsList'
import CustomerListSearch from '@/views/Events/Events/CustomerList/components/CustomerListSearch'
import cloneDeep from 'lodash/cloneDeep'

const EventsTableTools = () => {
    const { tableData, setTableData } = useEventsList()

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    return <CustomerListSearch onInputChange={handleInputChange} />
}

export default EventsTableTools
