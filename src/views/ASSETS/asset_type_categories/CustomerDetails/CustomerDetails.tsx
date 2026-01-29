import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { FaLayerGroup } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { apiGetAssetTypeCategoryById } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/asset_type_categories', id as string],
        ([_, idParam]) => apiGetAssetTypeCategoryById<any>(idParam as string),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
                    >
                        <TbArrowNarrowLeft className="text-lg" />
                        Back
                    </button>
                    
                   
                </div>

                {data && !isEmpty(data) ? (
                    <div className="space-y-6">
                        {/* Main Info Card */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        {data.name}
                                    </h2>
                                    {data.code && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Code: <span className="font-medium">{data.code}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Description Card */}
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                Description
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                                {data.description ? (
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {data.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 dark:text-gray-500 italic">
                                        No description provided
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <div className="py-12">
                            <FaLayerGroup className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No Asset Type Category Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                The requested category could not be found.
                            </p>
                            <button
                                onClick={handleBack}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                                Return to list
                            </button>
                        </div>
                    </Card>
                )}
            </Container>
        </Loading>
    )
}

export default CustomerDetails