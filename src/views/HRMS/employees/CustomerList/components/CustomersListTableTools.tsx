import useCustomerList from '../hooks/useCustomerList'
import CustomerListSearch from './CustomerListSearch'
import CustomerTableFilter from './CustomerListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const CustomersListTableTools = () => {
    const { tableData, setTableData } = useCustomerList()

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
            <CustomerListSearch onInputChange={handleInputChange} />
            <CustomerTableFilter />
        </>
    )
}

export default CustomersListTableTools
