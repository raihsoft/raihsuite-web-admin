import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { mutate } from 'swr'
import { apiCreateAssets } from '@/services/CustomersService'
import { useCustomerListStore } from '../AssetList/store/customerListStore'
import type { CustomerFormSchema } from '../CustomerForm'

const CustomerEdit = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // ✅ Form Submit
const handleFormSubmit = async (values: CustomerFormSchema) => {
    setIsSubmitting(true)

    try {
        const formData = new FormData()

        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('file_type', values.file_type)
        formData.append('asset_type_ref', values.asset_type_ref)
        formData.append('asset_category', values.asset_category)

        // tags
        formData.append(
            'tags',
            JSON.stringify(values.tags || [])
        )

        // file
        if (values.file) {
            formData.append('file', values.file)
        }

        await apiCreateAssets(formData)

        toast.push(
            <Notification type="success">
                Asset Created Successfully!
            </Notification>,
            { placement: 'top-center' }
        )

        const { tableData, filterData } =
            useCustomerListStore.getState()

        await mutate([
            '/api/assets',
            { ...tableData, ...filterData },
        ])

        navigate('/assets')
    } catch (error) {
        toast.push(
            <Notification type="danger">
                Failed to create asset
            </Notification>,
            { placement: 'top-center' }
        )
    } finally {
        setIsSubmitting(false)
    }
}

    // ✅ Confirm discard
    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="warning">Changes discarded!</Notification>,
            { placement: 'top-center' }
        )
        navigate('/assets')
    }

    // ✅ Discard / Cancel handlers
    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    return (
        <>
            <CustomerForm
                newCustomer
                defaultValues={{
                    title: '',
                    description: '',
                    file_type: '',
                    asset_type_ref: '',
                    asset_category: '',
                    tags: [],        
                    img: '',
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
                                loading={isSubmitting}
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
                    Are you sure you want to discard this? This action can’t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit
