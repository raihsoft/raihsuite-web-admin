import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import { apiCreateAssetTypeCategory } from '@/services/CustomersService'
import { mutate } from 'swr'
import { useCustomerListStore } from '../AssetTypeCategoriesList/store/customerListStore'
import { getTenantId } from '@/utils/tenant'

const CustomerEdit = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        try {
            setIsSubmiting(true)
            const tenant = getTenantId()
            if (!tenant) {
                toast.push(
                    <Notification type="danger">Tenant not found. Please login again.</Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            // ✅ Use JSON payload instead of FormData
            const payload = {
                name: values.name,
                description: values.description || '',
                tenant,
            }

            // console.log('Submitting payload:', payload)

            await apiCreateAssetTypeCategory(payload)

            // ✅ Revalidate SWR cache
            const { tableData, filterData } = useCustomerListStore.getState()
            await mutate(['/api/asset_type_categories', { ...tableData, ...filterData }])

            toast.push(
                <Notification type="success">Category created!</Notification>,
                { placement: 'top-center' },
            )
            navigate('/asset_type_categories')
        } catch (err: any) {
            console.error('Create failed:', err.response?.data || err.message)
            toast.push(
                <Notification type="danger">Create failed!</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Customer discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/asset-type-categories')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <CustomerForm
                newCustomer
                defaultValues={{
                    name: '',
                    description: '',
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can&apos;t
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit
