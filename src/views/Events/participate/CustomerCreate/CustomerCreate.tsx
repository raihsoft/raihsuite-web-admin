import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateParticipant } from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import type { UseFormSetError } from 'react-hook-form'

const CustomerCreate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const eventId = searchParams.get('eventId') ?? ''
    const returnTo =
        searchParams.get('returnTo') ??
        (eventId ? `/events/${eventId}` : '/participants')

    const handleFormSubmit = async (
        values: CustomerFormSchema,
        setError: UseFormSetError<CustomerFormSchema>
    ) => {
        setIsSubmiting(true)

        try {
            // ✅ INCLUDE fee_amount
            const payload = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone: values.phone,
                event: values.event,
                place: values.place,
                referred_by: values.referred_by || '',
                fee_amount: values.fee_amount
                    ? Number(values.fee_amount)
                    : undefined,
            }

            await apiCreateParticipant(payload)

            toast.push(
                <Notification type="success">
                    Participant created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            navigate(returnTo)
        } catch (err: any) {
            if (!err.response) {
                toast.push(
                    <Notification type="danger">
                        Network error. Please check your connection.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }

            const errorData = err.response?.data

            // ✅ PHONE ERROR HANDLING
            if (errorData?.phone) {
                const phoneErrorMessage = Array.isArray(errorData.phone)
                    ? errorData.phone[0]
                    : errorData.phone

                setError(
                    'phone',
                    {
                        type: 'server',
                        message: phoneErrorMessage,
                    },
                    { shouldFocus: true }
                )
                return
            }

            const errorMessage =
                errorData?.message ||
                errorData?.detail ||
                errorData?.error ||
                `Error: ${err.response?.status || 'Unknown'}`

            toast.push(
                <Notification type="danger">
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <>
            <CustomerForm
                newCustomer
                defaultValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    event: eventId,
                    place: '',
                    referred_by: '',
                    fee_amount: '', // ✅ DEFAULT VALUE ADDED
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span />
                        <div className="flex items-center">
                            <Button
                                type="button"
                                className="ltr:mr-3 rtl:ml-3"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={() =>
                                    setDiscardConfirmationOpen(true)
                                }
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
                onConfirm={() => navigate(returnTo)}
            >
                <p>
                    Are you sure you want to discard this? This action can&apos;t
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerCreate
