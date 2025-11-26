import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetAssetById, apiUpdateAsset, apiDeleteAsset } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import { mutate } from 'swr'
import { useCustomerListStore } from '../AssetList/store/customerListStore'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../AssetList/types'

const CustomerEdit = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        ['/api/assets', id as string],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, idParam]) => apiGetAssetById<Customer>(idParam as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const tableData = useCustomerListStore((s) => s.tableData)
    const filterData = useCustomerListStore((s) => s.filterData)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!id) return
        try {
            setIsSubmiting(true)
            // prepare payload — keep simple and send as JSON; if file update required use FormData
            const payload: any = {
                title: values.title,
                description: values.description,
                file_type: values.file_type,
                asset_type_ref: values.asset_type_ref,
                asset_category: values.asset_category,
                tags: values.tags,
            }

            await apiUpdateAsset(id as string, payload)
            toast.push(<Notification type="success">Changes Saved!</Notification>, {
                placement: 'top-center',
            })
            // revalidate list
            await mutate(['/api/assets', { ...tableData, ...filterData }])
            navigate('/assets')
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
            const { title, description, file_type, asset_type_ref, asset_category, tags } = data as any

            return {
                title,
                description,
                file_type,
                asset_type_ref,
                asset_category,
                tags,
            }
        }

        return {}
    }

    const handleConfirmDelete = async () => {
        if (!id) return
        try {
            await apiDeleteAsset(id as string)
            toast.push(<Notification type="success">Asset deleted!</Notification>, {
                placement: 'top-center',
            })
            // revalidate list with current table/filter state
            await mutate(['/api/assets', { ...tableData, ...filterData }])
            navigate('/assets')
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
        history.back()
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No asset found!</h3>
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
