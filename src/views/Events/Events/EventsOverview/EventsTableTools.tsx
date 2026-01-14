import useEventsList from './hooks/useEventsList'
import CustomerListSearch from '@/views/Events/Events/CustomerList/components/CustomerListSearch'
import CustomerTableFilter from '@/views/Events/Events/CustomerList/components/CustomerListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const EventsTableTools = () => {
    const { tableData, setTableData } = useEventsList()

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CustomerListSearch onInputChange={handleInputChange} />
            <CustomerTableFilter />
        </div>
    )
}

export default EventsTableTools
