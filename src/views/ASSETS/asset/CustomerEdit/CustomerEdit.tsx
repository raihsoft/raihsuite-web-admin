import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetAssets, apiUpdateAssets } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../AssetList/types'

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, mutate } = useSWR(
        [`/asset/assets/${id}`, { id: id as string }],
        ([_, params]) => apiGetAssets<Customer, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },concepts/customers/customer-details
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 👉 REPLACED WITH YOUR VERSION (correct placement)
    const handleFormSubmit = async (values: CustomerFormSchema) => {
        try {
            setIsSubmitting(true)
            await apiUpdateAssets(id as string, values)

            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                { placement: 'top-center' },
            )

            mutate() // refresh SWR
            navigate('/employees')
        } catch (error) {
            toast.push(
                <Notification type="danger">Update failed!</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const getDefaultValues = () => {
        if (data) {
            const {
                title,
                file_extension,
                file_type,
                asset_type_ref,
                img,
                tags,
                description,
                asset_category,
            } = data

            return {
                title,
                file_type,
                file_extension,
                asset_type_ref,
                img,
                tags,
                description,
                asset_category,
            }
        }
        return {}
    }

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        toast.push(
            <Notification type="success">Customer deleted!</Notification>,
            { placement: 'top-center' },
        )
    }

    const handleDelete = () => setDeleteConfirmationOpen(true)

    const handleCancel = () => setDeleteConfirmationOpen(false)

    const handleBack = () => history.back()

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}

            {!isLoading && data && (
                <>
                    <CustomerForm
                        defaultValues={getDefaultValues() as CustomerFormSchema}
                        newCustomer={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>

                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>

                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </CustomerForm>

                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Remove customers"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        Are you sure you want to delete this customer?
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
