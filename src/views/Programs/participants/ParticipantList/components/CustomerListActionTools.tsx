import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useCustomerList from '../hooks/useCustomerList'
import { CSVLink } from 'react-csv'

const formatCustomData = (customData: unknown): string => {
    if (customData === null || customData === undefined) {
        return ''
    }

    if (typeof customData === 'string') {
        try {
            const parsed = JSON.parse(customData)
            return formatCustomData(parsed)
        } catch {
            return customData
        }
    }

    if (typeof customData !== 'object') {
        return String(customData)
    }

    if (Array.isArray(customData)) {
        return customData
            .map((value) => formatCustomData(value))
            .filter(Boolean)
            .join(', ')
    }

    const entries = Object.entries(customData as Record<string, unknown>)

    if (entries.length === 0) {
        return ''
    }

    return entries
        .map(([key, value]) => `${key}: ${formatCustomData(value)}`)
        .join(', ')
}

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    const { customerList } = useCustomerList()

    const downloadData = customerList.map((item) => ({
        ...item,
        custom_data: formatCustomData(item.custom_data),
    }))

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="customerList.csv"
                data={downloadData}
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
                onClick={() => navigate('/program-participants/create')}
            >
                Add new
            </Button>
        </div>
    )
}

export default CustomerListActionTools



