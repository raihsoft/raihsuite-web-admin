import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiDeleteSession,
    apiUpdateSession,
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
        id ? `/session/${id}` : null,
        () => apiUpdateSession(id as string),
        { revalidateOnFocus: false },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getDefaultValues = (): CustomerFormSchema | undefined => {
        if (!data) return

        return {

            event: String(data.event ?? ''),
            title: data.title ?? '',
            start_datetime: data.start_datetime ?? '',
            end_datetime: data.end_datetime ?? '',
            speaker: data.speaker ?? '',
            location: data.location ?? '',
        }
    }

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!id) return
        setIsSubmitting(true)

        try {
            await apiUpdateSession(id, {
                event: values.event,
                title: values.title,
                start_datetime: values.start_datetime,
                end_datetime: values.end_datetime,
                speaker: values.speaker,
                location: values.location,
            })

            toast.push(
                <Notification type="success">
                  Session updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(data?.event ? `/events/${data.event}` : '/session')

            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to update session
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
            await apiDeleteSession(id)
            toast.push(
                <Notification type="success">
                    Session deleted!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate(data?.event ? `/events/${data.event}` : '/session')
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    if (!isLoading && !data) {
        return (
            <div className="h-full flex items-center justify-center">
                <p>No session found</p>
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
                        title="Remove partisessioncipant"
                        onClose={() => setDeleteConfirmationOpen(false)}
                        onConfirm={handleConfirmDelete}
                        confirmButtonProps={{ loading: deleteLoading }}
                    >
                        Are you sure you want to remove this session?
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
