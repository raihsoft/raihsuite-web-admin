import useCustomerList from '../hooks/useCustomerList'
import CustomerListSearch from './CustomerListSearch'
import CustomerTableFilter from './CustomerListTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'

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

    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex-1 flex items-center gap-2">
                <CustomerListSearch onInputChange={handleInputChange} />
            </div>
            <div className="flex items-center gap-3">
                {/* <CSVLink
                    className="w-full"
                    filename="assetList.csv"
                    data={[]}
                >
                    <Button
                        icon={<TbCloudDownload className="text-xl" />}
                        className="w-full"
                    >
                        Download
                    </Button>
                </CSVLink> */}
                {/* <Button
                    variant="solid"
                    icon={<TbUserPlus className="text-xl" />}
                    onClick={() => navigate('/assets/create')}
                >
                    Add new
                </Button> */}
                <CustomerTableFilter />
            </div>
        </div>
    )
}

export default CustomersListTableTools
