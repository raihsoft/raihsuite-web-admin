import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateProgram, apiCreateParticipantCustomField } from '@/services/CustomersService'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema, ParticipantCustomField } from '../CustomerForm/types'

type FormValues = CustomerFormSchema & {
    customFields?: ParticipantCustomField[]
}

const CustomerCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)


    // 

    // =========================
    // SUBMIT
    // =========================
    const handleFormSubmit = async (values: FormValues) => {
        setIsSubmitting(true)

        try {
            const payload = {
                name: values.name,
                code: values.code,
                description: values.description,
                start_date: values.start_date,
                end_date: values.end_date,
            }

            // console.log('🚀 FINAL PAYLOAD:', payload)

            const res = await apiCreateProgram<{ id: string }, Record<string, unknown>>(payload)
            const programId = res?.id

            if (programId && values.customFields && values.customFields.length > 0) {
                for (const field of values.customFields) {
                    await apiCreateParticipantCustomField({
                        program: programId,
                        label: field.label,
                        field_key: field.field_key,
                        field_type: field.field_type,
                        is_required: field.is_required,
                        placeholder: field.placeholder || '',
                        order: field.order,
                        is_active: field.is_active ?? true,
                        options: ['select', 'checkbox'].includes(field.field_type) ? (field.options || []) : [],
                    })
                }
            }

            toast.push(
                <Notification type="success">
                    Program created successfully
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/programs')
        } catch {
            // console.log('❌ CREATE ERROR:', error)

            toast.push(
                <Notification type="danger">
                    Failed to create program    
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <CustomerForm
                newCustomer
                // ✅ IMPORTANT FIX
                defaultValues={{
                    name: '',
                    code: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    email: '',
                    phone: '',
                    place: '',
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex justify-end gap-3 px-8">
                        <Button
                            type="button"
                            onClick={() => setDiscardConfirmationOpen(true)}
                        >
                            Discard
                        </Button>

                        <Button type="submit" variant="solid" loading={isSubmitting}>
                            Create
                        </Button>
                    </div>
                </Container>
            </CustomerForm>

            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                onClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
                onConfirm={() => navigate('/programs')}
            >
                Are you sure you want to discard?
            </ConfirmDialog>
        </>
    )
}

export default CustomerCreate