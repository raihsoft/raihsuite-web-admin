import { useState, useEffect } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {apiCreateProgram } from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

type ProgramOption = {
    label: string
    value: string
}

const CustomerCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)


    // 

    // =========================
    // SUBMIT
    // =========================
    const handleFormSubmit = async (values: any) => {
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

            await apiCreateProgram(payload)

            toast.push(
                <Notification type="success">
                    Program created successfully
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/programs')
        } catch (error) {
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