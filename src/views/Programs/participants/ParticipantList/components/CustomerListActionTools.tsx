import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useCustomerList from '../hooks/useCustomerList'
import { CSVLink } from 'react-csv'

const parseCustomData = (
    customData: unknown
): Record<string, unknown> => {
    if (customData === null || customData === undefined) {
        return {}
    }

    if (typeof customData === 'string') {
        try {
            return JSON.parse(customData) as Record<
                string,
                unknown
            >
        } catch {
            return {}
        }
    }

    if (
        typeof customData === 'object' &&
        !Array.isArray(customData)
    ) {
        return customData as Record<
            string,
            unknown
        >
    }

    return {}
}

const formatCustomData = (customData: unknown): string => {
    if (customData === null || customData === undefined) {
        return ''
    }

    if (typeof customData === 'string') {
        try {
            return formatCustomData(
                JSON.parse(customData)
            )
        } catch {
            return customData
        }
    }

    if (Array.isArray(customData)) {
        return customData
            .map((value) => formatCustomData(value))
            .filter(Boolean)
            .join(', ')
    }

    if (typeof customData === 'object') {
        return Object.entries(
            customData as Record<string, unknown>
        )
            .map(
                ([key, value]) =>
                    `${key}: ${formatCustomData(value)}`,
            )
            .join(', ')
    }

    return String(customData)
}

const getCustomField = (
    customData: unknown,
    field: string
): string => {
    const parsed = parseCustomData(customData)
    const value = parsed[field]

    if (value === null || value === undefined) {
        return ''
    }

    if (typeof value === 'object') {
        return formatCustomData(value)
    }

    return String(value)
}

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    const { customerList } = useCustomerList()

    const downloadData = customerList.map((item) => {
        const { custom_data, ...rest } = item

        return {
            ...rest,
            scheme: getCustomField(custom_data, 'scheme'),
            ration_card_category: getCustomField(
                custom_data,
                'ration_card_category',
            ),
            course: getCustomField(custom_data, 'course'),
        }
    })

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



