import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiGetParticipant,
    apiDeleteParticipant,
    apiUpdateParticipant,
} from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../types'

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, mutate } = useSWR(
        id ? `/participants/${id}` : null,
        () => apiGetParticipant(id as string),
        { revalidateOnFocus: false }
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    /* ✅ DEFAULT VALUES (INCLUDING fee_amount) */
    const getDefaultValues = (): CustomerFormSchema | undefined => {
        if (!data) return

        return {
            firstName: data.first_name ?? '',
            lastName: data.last_name ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            place: data.place ?? '',
            event: String(data.event ?? ''),
            referred_by: data.referred_by ?? '',
            fee_amount: data.fee_amount ?? '0.00', // ✅ ADDED
        }
    }

    /* ✅ SUBMIT */
    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!id) return
        setIsSubmitting(true)

        try {
            await apiUpdateParticipant(id, {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone: values.phone,
                place: values.place,
                event: values.event,
                referred_by: values.referred_by,
                fee_amount: values.fee_amount, // ✅ SEND TO BACKEND
            })

            toast.push(
                <Notification type="success">
                    Participant updated successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            // navigate('/participants')
            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to update participant
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    /* DELETE */
    const handleConfirmDelete = async () => {
        if (!id) return
        setDeleteLoading(true)

        try {
            await apiDeleteParticipant(id)
            toast.push(
                <Notification type="success">
                    Participant deleted!
                </Notification>,
                { placement: 'top-center' }
            )
            navigate('/participants')
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    if (!isLoading && !data) {
        return (
            <div className="h-full flex items-center justify-center">
                <p>No participant found</p>
            </div>
        )
    }

    return (
        <>
            {!isLoading && data && (
                <>
                    <CustomerForm
                        defaultValues={getDefaultValues()}
                        newCustomer={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex justify-between px-8">
                                <Button
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        icon={<TbTrash />}
                                        onClick={() =>
                                            setDeleteConfirmationOpen(true)
                                        }
                                        customColorClass={() =>
                                            'border-error text-error'
                                        }
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
                        title="Remove participant"
                        onClose={() => setDeleteConfirmationOpen(false)}
                        onConfirm={handleConfirmDelete}
                        confirmButtonProps={{ loading: deleteLoading }}
                    >
                        Are you sure you want to remove this participant?
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
