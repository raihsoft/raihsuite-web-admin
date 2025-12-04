import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { FaFileAlt, FaTags } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { apiGetAssetById } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'

const CustomerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/assets', id as string],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, idParam]) => apiGetAssetById<any>(idParam as string),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const handleBack = () => navigate(-1)

    return (
        <Loading loading={isLoading}>
            <Container>
                <div className="flex items-center justify-between px-8">
                    <button
                        type="button"
                        className="btn-plain"
                        onClick={handleBack}
                    >
                        <TbArrowNarrowLeft /> Back
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    <h3 className="text-3xl font-semibold mb-4">Asset Details</h3>

                    {data && !isEmpty(data) ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <Card className="h-full">
                                    <div className="p-6">
                                        <h4 className="text-2xl font-semibold mb-2">{data.title}</h4>
                                        <div className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300 mb-2">
                                            <FaFileAlt className="text-lg text-gray-500" />
                                            <span className="text-sm">{data.file_extension || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300">
                                            <FaTags className="text-lg text-gray-500" />
                                            <span className="text-sm">{Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '—')}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold mb-3">Description</h4>
                                        <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{data.description || '—'}</p>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                        <div className="p-4">
                                            <h5 className="text-base font-medium text-gray-600">Asset Type Ref</h5>
                                            <p className="text-base text-gray-900 dark:text-gray-100">{data.asset_type_ref || '—'}</p>
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className="p-4">
                                            <h5 className="text-base font-medium text-gray-600">Asset Category</h5>
                                            <p className="text-base text-gray-900 dark:text-gray-100">{data.asset_category || '—'}</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-gray-600">No data found.</p>
                    )}
                </div>
            </Container>
        </Loading>
    )
}

export default CustomerDetails
