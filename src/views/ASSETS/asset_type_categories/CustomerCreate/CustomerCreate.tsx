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

const CustomerEdit = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        setIsSubmiting(true)

        try {
            // ✅ CLEAN PAYLOAD (NO TENANT)
            const payload = {
                name: values.name,
                description: values.description || '',
            }

            await apiCreateAssetTypeCategory(payload)

            const { tableData, filterData } =
                useCustomerListStore.getState()

            await mutate([
                '/api/asset_type_categories',
                { ...tableData, ...filterData },
            ])

            toast.push(
                <Notification type="success">
                    Category created!
                </Notification>,
                { placement: 'top-center' },
            )

            navigate('/asset_type_categories')
        } catch (err) {
            toast.push(
                <Notification type="danger">
                    Create failed!
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)

        toast.push(
            <Notification type="warning">
                Changes discarded!
            </Notification>,
            { placement: 'top-center' },
        )

        navigate('/asset_type_categories')
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
                        <span />
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={() => setDiscardConfirmationOpen(true)}
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
                onClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
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