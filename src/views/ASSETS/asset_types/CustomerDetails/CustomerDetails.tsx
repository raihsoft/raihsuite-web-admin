import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { FaFileAlt } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { apiGetAssetTypeById } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/asset_types', id as string],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, idParam]) => apiGetAssetTypeById<any>(idParam as string),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        <TbArrowNarrowLeft className="text-lg" />
                        Back
                    </button>
                </div>

                {/* Title */}
                <div className="mb-8">
                    
                    <p className="text-sm text-gray-500 mt-1">
                        View detailed information about this asset type
                    </p>
                </div>

               {data && !isEmpty(data) ? (
    <Card>
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Info Card */}
                <Card className="lg:col-span-1">
                    <div className="p-6 space-y-4">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {data.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                                Asset Type Name
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                            <FaFileAlt className="text-gray-400" />
                            <span>
                                {data.file_extension || 'No file extension'}
                            </span>
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-500">
                                Asset Code
                            </span>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {data.code || '—'}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Right Content */}
                <Card className="lg:col-span-2">
                    <div className="p-6">
                        <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                            Description
                        </h4>

                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {data.description || 'No description provided.'}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    </Card>
) : (
    <Card>
        <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
                No asset type data found.
            </p>
        </div>
    </Card>
)}
            </Container>
        </Loading>
    )
}

export default CustomerDetails
