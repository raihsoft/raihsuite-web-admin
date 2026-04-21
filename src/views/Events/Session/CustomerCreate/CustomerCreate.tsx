import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { apiCreateParticipant, apiCreateSession } from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'

const CustomerEdit = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

   const handleFormSubmit = async (values: CustomerFormSchema) => {
    setIsSubmiting(true)
    try {
        const payload = {
            event: values.event,
            // event_title: values.event_title,
            title: values.title,
            start_datetime: values.start_datetime,
            end_datetime: values.end_datetime,
            day: values.day,
            speaker: values.speaker,
            location: values.location,
        }

        await apiCreateSession(payload)

        toast.push(
            <Notification type="success">Session created!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/session')
    } catch (err: any) {
        const data = err?.response?.data
        if (data && typeof data === 'object') {
            const messages = Object.entries(data)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                .join(' \n')
            toast.push(
                <Notification type="danger">Failed to create session: {messages}</Notification>,
                { placement: 'top-center' },
            )
        } else {
            toast.push(
                <Notification type="danger">Failed to create session</Notification>,
                { placement: 'top-center' },
            )
        }
        // console.error(err)
    } finally {
        setIsSubmiting(false)
    }
}

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Customer discardd!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/participants')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <CustomerForm
                newCustomer
                defaultValues={{
                    event: '',
                    // event_title: '',
                    title: '',
                    start_datetime: '',
                    end_datetime: '',
                    day: '',
                    speaker: '',
                    location: '',
                }}

                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
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
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit
