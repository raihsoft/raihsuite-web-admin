import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetAssetTypeCategoryById, apiUpdateAssetTypeCategory, apiDeleteAssetTypeCategory } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import sleep from '@/utils/sleep'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { mutate } from 'swr'
import { useCustomerListStore } from '../AssetTypeCategoriesList/store/customerListStore'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../AssetTypeCategoriesList/types'
import { dE } from '@fullcalendar/core/internal-common'

const CustomerEdit = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, error, isLoading } = useSWR(
        ['/api/asset_type_categories', id as string],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, idParam]) => apiGetAssetTypeCategoryById<Customer>(idParam as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!id) return
        try {
            setIsSubmiting(true)
            await apiUpdateAssetTypeCategory(id as string, values)
            toast.push(<Notification type="success">Changes Saved!</Notification>, {
                placement: 'top-center',
            })
            // revalidate list
            const { tableData, filterData } = useCustomerListStore.getState()
            await mutate(['/api/asset_type_categories', { ...tableData, ...filterData }])
            navigate('/asset-type-categories')
        } catch (error) {
            toast.push(<Notification type="danger">Update failed!</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setIsSubmiting(false)
        }
    }

    const getDefaultValues = () => {
        if (data) {
            const { name, description } = data

            return {
                name,
                description
            }
        }

        return {}
    }

    const handleConfirmDelete = async () => {
        if (!id) return
        try {
            await apiDeleteAssetTypeCategory(id as string)
            toast.push(<Notification type="success">Category deleted!</Notification>, {
                placement: 'top-center',
            })
            const { tableData, filterData } = useCustomerListStore.getState()
            await mutate(['/api/asset_type_categories', { ...tableData, ...filterData }])
            navigate('/asset-type-categories')
        } catch (error) {
            toast.push(<Notification type="danger">Delete failed!</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <>
            {!isLoading && error && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">Failed to load category</h3>
                    <p className="mt-2 text-sm text-muted break-words">{String(error)}</p>
                </div>
            )}
            {!isLoading && !data && !error && (
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
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
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
                                        loading={isSubmiting}
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
                        <p>
                            Are you sure you want to remove this customer? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
