import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiUpdateTicket,
    apiGetTicketDetails,
} from '@/services/CustomersService'
import { apiDeleteTicket } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../CustomerForm'

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const eventId = searchParams.get('event') ?? ''
    const returnTo = searchParams.get('returnTo') ?? '/ticket'

    const { data, isLoading, mutate } = useSWR(
        id ? `/ticket/${id}` : null,
        () => apiGetTicketDetails(id as string),
        { revalidateOnFocus: false },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getDefaultValues = (): CustomerFormSchema | undefined => {
        if (!data) return

        const ticket = data as any
        return {
            event: ticket.event ?? '',
            participant: ticket.participant ?? '',
        }
    }

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!id) return
        setIsSubmitting(true)

        try {
            await apiUpdateTicket(id, {
                event: values.event || '',
                participant: values.participant || '',
            })

            toast.push(
                <Notification type="success">
                    Ticket updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(returnTo)

            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to update ticket
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!id) return
        setDeleteLoading(true)

        try {
            await apiDeleteTicket(id)
            toast.push(
                <Notification type="success">
                    Ticket deleted!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(returnTo)
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    if (!isLoading && !data) {
        return (
            <div className="h-full flex items-center justify-center">
                <p>No ticket found</p>
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
                        disableEvent={!!eventId}
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
                        title="Remove ticket"
                        onClose={() => setDeleteConfirmationOpen(false)}
                        onConfirm={handleConfirmDelete}
                        confirmButtonProps={{ loading: deleteLoading }}
                    >
                        Are you sure you want to remove this ticket?
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
