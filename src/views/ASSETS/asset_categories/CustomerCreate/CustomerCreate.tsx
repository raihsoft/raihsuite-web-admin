import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiGetAssetCategoryById,
    apiUpdateAssetCategory,
    apiDeleteAssetCategory,
    apiCreateAssetCategories,
} from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import { useCustomerListStore } from '../AssetCategoriesList/store/customerListStore'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../AssetCategoriesList/types'

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isModeEdit = Boolean(id)

    const { data, isLoading } = useSWR(
        isModeEdit ? ['/api/asset_categories', id as string] : null,
        ([, idParam]) => apiGetAssetCategoryById<Customer>(idParam as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const tableData = useCustomerListStore((s) => s.tableData)
    const filterData = useCustomerListStore((s) => s.filterData)

    // ✅ CLEAN FORM SUBMIT (NO TENANT)
    const handleFormSubmit = async (values: CustomerFormSchema) => {
        setIsSubmiting(true)

        try {
            const payload = {
                ...values,
            }

            if (isModeEdit) {
                await apiUpdateAssetCategory(id as string, payload)

                toast.push(
                    <Notification type="success">
                        Category Updated Successfully!
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                await apiCreateAssetCategories(payload)

                toast.push(
                    <Notification type="success">
                        Category Created Successfully!
                    </Notification>,
                    { placement: 'top-center' }
                )
            }

            await mutate([
                '/api/asset_categories',
                { ...tableData, ...filterData },
            ])

            navigate('/assetcategories')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {isModeEdit
                        ? 'Failed to update category'
                        : 'Failed to create category'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const getDefaultValues = () => {
        if (isModeEdit && data) {
            const d: any = data
            return {
                name: d.name ?? '',
                code: d.code ?? '',
                title: d.title ?? '',
                description: d.description ?? '',
            }
        }

        return { name: '', code: '', title: '', description: '' }
    }

    const handleConfirmDelete = async () => {
        if (!isModeEdit) return

        try {
            await apiDeleteAssetCategory(id as string)

            toast.push(
                <Notification type="success">
                    Category deleted!
                </Notification>,
                { placement: 'top-center' }
            )

            await mutate([
                '/api/asset_categories',
                { ...tableData, ...filterData },
            ])

            navigate('/assets-category')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Delete failed!
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)

        toast.push(
            <Notification type="warning">
                Changes discarded!
            </Notification>,
            { placement: 'top-center' }
        )

        navigate('/assets-category')
    }

    if (isModeEdit && isLoading) return <div>Loading...</div>

    if (isModeEdit && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h3 className="mt-8">No Asset Category found!</h3>
                <Button onClick={() => navigate(-1)} className="mt-4">
                    Go Back
                </Button>
            </div>
        )
    }

    return (
        <>
            <CustomerForm
                defaultValues={getDefaultValues() as CustomerFormSchema}
                newCustomer={!isModeEdit}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>

                        <div className="flex items-center">
                            <Button
                                type="button"
                                className="ltr:mr-3 rtl:ml-3"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={() =>
                                    isModeEdit
                                        ? setDeleteConfirmationOpen(true)
                                        : setDiscardConfirmationOpen(true)
                                }
                            >
                                {isModeEdit ? 'Delete' : 'Discard'}
                            </Button>

                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                {isModeEdit ? 'Save' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>

            {/* Delete */}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Category"
                onClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleConfirmDelete}
            >
                <p>Are you sure you want to remove this category?</p>
            </ConfirmDialog>

            {/* Discard */}
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="warning"
                title="Discard Changes"
                onClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
                onConfirm={handleConfirmDiscard}
            >
                <p>Are you sure you want to discard your changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit