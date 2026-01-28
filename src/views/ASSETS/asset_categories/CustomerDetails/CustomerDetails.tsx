import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { FaTag, FaInfoCircle } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { apiGetAssetCategoryById } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/asset_categories', id as string],
        ([_, idParam]) => apiGetAssetCategoryById<any>(idParam as string),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container className="py-6">
                {/* Header with back button and title */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    >
                        <TbArrowNarrowLeft className="text-lg" />
                        Back
                    </button>
                  
                </div>

                {data && !isEmpty(data) ? (
                    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="p-6 md:p-8">
                            {/* Main info row */}
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                            <FaTag className="text-xl text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {data.name}
                                            </h2>
                                            {data.title && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                    {data.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">
                                                Code
                                            </span>
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-mono">
                                                {data.code || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:text-right">
                                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                        Asset Category
                                    </span>
                                </div>
                            </div>

                            {/* Description section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <FaInfoCircle className="text-gray-500 dark:text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Description
                                    </h3>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5">
                                    {data.description ? (
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {data.description}
                                        </p>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                                No description provided
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional info section (if needed in future) */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                            Last Updated
                                        </h4>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {data.updated_at ? 
                                                new Date(data.updated_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 
                                                'N/A'
                                            }
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-8 text-center">
                        <div className="max-w-md mx-auto py-12">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <FaTag className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No Asset Category Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                The requested asset category could not be found or has been removed.
                            </p>
                            <button
                                onClick={handleBack}
                                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <TbArrowNarrowLeft />
                                Return to List
                            </button>
                        </div>
                    </Card>
                )}
            </Container>
        </Loading>
    )
}

export default CustomerDetails