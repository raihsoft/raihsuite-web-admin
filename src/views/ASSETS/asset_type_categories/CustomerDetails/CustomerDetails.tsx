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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, idParam]) => apiGetAssetTypeCategoryById<any>(idParam as string),
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
                    <h3 className="text-3xl font-semibold mb-4">Asset Type Category Details</h3>

                    {data && !isEmpty(data) ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <Card className="h-full">
                                    <div className="p-6">
                                        <h4 className="text-2xl font-semibold mb-2">{data.name}</h4>
                                        <div className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300">
                                            <FaLayerGroup className="text-lg text-gray-500" />
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
