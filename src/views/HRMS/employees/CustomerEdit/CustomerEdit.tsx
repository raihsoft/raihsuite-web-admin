import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetEmployeeById, apiUpdateEmployee, apiDeleteEmployee } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../CustomerList/types'

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, mutate } = useSWR(
        id ? `/hrms/employees/${id}/` : null,
        () => apiGetEmployeeById<Customer>(id as string),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        try {
            setIsSubmitting(true)
            await apiUpdateEmployee(id as string, values)

            toast.push(<Notification type="success">Changes Saved!</Notification>, {
                placement: 'top-center',
            })
            mutate() // refresh SWR data
            navigate('/employees')
        } catch (error) {
            toast.push(<Notification type="danger">Update failed!</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const getDefaultValues = () => {
        if (!data) return {}
        const {
            name,
            designation,
            email_link,
            organization,
            facebook_link,
            linkedin_link,
            instagram_link,
            youtube_link,
            website_link,
            img,
        } = data

        return {
            name,
            designation,
            email_link,
            organization,
            facebook_link,
            linkedin_link,
            instagram_link,
            youtube_link,
            website_link,
            img,
            tags: [],
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteEmployee(id as string)
            toast.push(<Notification type="success">Employee deleted!</Notification>, {
                placement: 'top-center',
            })
            navigate('/employees')
        } catch (error) {
            toast.push(<Notification type="danger">Delete failed!</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    const handleDelete = () => setDeleteConfirmationOpen(true)
    const handleCancel = () => setDeleteConfirmationOpen(false)
    const handleBack = () => navigate(-1)

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
                        defaultValues={getDefaultValues() as unknown as CustomerFormSchema}
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
                                        style={{marginLeft:"10px"}}
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
                        title="Remove Employee"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>Are you sure you want to remove this employee? This action can&apos;t be undone.</p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
