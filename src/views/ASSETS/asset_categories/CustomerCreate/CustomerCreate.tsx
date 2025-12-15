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
    apiCreateAssetCategories // Ensuring plural import
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

    // Fetch data ONLY if editing
    const { data, error, isLoading } = useSWR(
        isModeEdit ? ['/api/asset_categories', id as string] : null,
        ([, idParam]) => apiGetAssetCategoryById<Customer>(idParam as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false) // Added Discard state
    const [isSubmiting, setIsSubmiting] = useState(false)

    const tableData = useCustomerListStore((s) => s.tableData)
    const filterData = useCustomerListStore((s) => s.filterData)

    // ✅ Form Submit (Adapted from your Asset Code)
    const handleFormSubmit = async (values: CustomerFormSchema) => {
        console.log('🟢 Submitted values:', values)
        setIsSubmiting(true)

        try {
            // 1. Get Tenant (Same as your Asset logic)
            const tenant = localStorage.getItem('tenant')
            if (!tenant) {
                toast.push(
                    <Notification type="danger">Tenant not found. Please login again.</Notification>,
                    { placement: 'top-center' }
                )
                return
            }

            // 2. Prepare Data 
            // Note: We use a standard Object (JSON) here, not FormData, 
            // because Categories usually don't have file uploads.
            const payload = {
                ...values,
                tenant: tenant // Add tenant to the data
            }

            // 3. API CALL
            if (isModeEdit) {
                // --- UPDATE ---
                await apiUpdateAssetCategory(id as string, payload)
                toast.push(
                    <Notification type="success">Category Updated Successfully!</Notification>, 
                    { placement: 'top-center' }
                )
            } else {
                // --- CREATE ---
                await apiCreateAssetCategories(payload)
                toast.push(
                    <Notification type="success">Category Created Successfully!</Notification>, 
                    { placement: 'top-center' }
                )
            }

            // 4. Refetch List
            await mutate(['/api/asset_categories', { ...tableData, ...filterData }])

            // 5. Navigate
            navigate('/assets-category')

        } catch (error) {
            console.error('❌ Error saving category:', error)
            toast.push(
                <Notification type="danger">
                    {isModeEdit ? 'Failed to update category' : 'Failed to create category'}
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

    // ✅ Delete Logic
    const handleConfirmDelete = async () => {
        if (!isModeEdit) return
        try {
            await apiDeleteAssetCategory(id as string)
            toast.push(<Notification type="success">Category deleted!</Notification>, {
                placement: 'top-center',
            })
            await mutate(['/api/asset_categories', { ...tableData, ...filterData }])
            navigate('/assets-category')
        } catch (error) {
            toast.push(<Notification type="danger">Delete failed!</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    // ✅ Discard Logic
    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="warning">Changes discarded!</Notification>,
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
                <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
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
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                        <div className="flex items-center">
                            {/* Discard Button */}
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={() => isModeEdit ? setDeleteConfirmationOpen(true) : setDiscardConfirmationOpen(true)}
                            >
                                {isModeEdit ? 'Delete' : 'Discard'}
                            </Button>

                            {/* Submit Button */}
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
            
            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Category"
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleConfirmDelete}
            >
                <p>Are you sure you want to remove this category? This action can't be undone.</p>
            </ConfirmDialog>

            {/* Discard Confirmation Dialog */}
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="warning"
                title="Discard Changes"
                onClose={() => setDiscardConfirmationOpen(false)}
                onRequestClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
                onConfirm={handleConfirmDiscard}
            >
                <p>Are you sure you want to discard your changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit