import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Loading from '@/components/shared/Loading'
import ProfileSection from './ProfileSection'
import BillingSection from './BillingSection'
import ActivitySection from './ActivitySection'
import { apiGetAssetById, apiGetAssetCategoriesById, apiGetEmployeeById } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { Customer } from '../AssetCategoriesList/types'
// import type { Customer } from '../CustomerList/types'

const { TabNav, TabList, TabContent } = Tabs

const CustomerDetails = () => {
    const { id } = useParams()

    const { data, isLoading } = useSWR(
        id ? [`/api/asset/asset_categories/${id}`] : null,
        () => apiGetAssetCategoriesById<Customer>(id as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return (
        <Loading loading={isLoading}>
            {!isEmpty(data) && (
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="min-w-[330px] 2xl:min-w-[400px]">
                        <ProfileSection data={data} />
                    </div>

                </div>
            )}
        </Loading>
    )
}

export default CustomerDetails
