import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import { TbArrowNarrowLeft } from 'react-icons/tb'
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
                <div className="flex items-center justify-between px-8">
                    <button
                        type="button"
                        className="btn-plain"
                        onClick={handleBack}
                    >
                        <TbArrowNarrowLeft /> Back
                    </button>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-semibold">Asset Type Details</h3>
                    {data && !isEmpty(data) ? (
                        <div className="mt-4 grid grid-cols-1 gap-3 max-w-2xl">
                            <Card>
                                <div>
                                    <h4 className="font-semibold">Name</h4>
                                    <p className="text-gray-700">{data.name}</p>
                                </div>
                            </Card>
                            <Card>
                                <div>
                                    <h4 className="font-semibold">Code</h4>
                                    <p className="text-gray-700">{data.code}</p>
                                </div>
                            </Card>
                            <Card>
                                <div>
                                    <h4 className="font-semibold">File Extension</h4>
                                    <p className="text-gray-700">{data.file_extension}</p>
                                </div>
                            </Card>
                            <Card>
                                <div>
                                    <h4 className="font-semibold">Description</h4>
                                    <p className="text-gray-700">{data.description}</p>
                                </div>
                            </Card>
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
