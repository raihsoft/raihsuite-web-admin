import useCustomerList from '../hooks/useCustomerList'
import CustomerListSearch from './CustomerListSearch'
import cloneDeep from 'lodash/cloneDeep'

const CustomersListTableTools = () => {
    const { tableData, setTableData } = useCustomerList()

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    return <CustomerListSearch onInputChange={handleInputChange} />
}

export default CustomersListTableTools
