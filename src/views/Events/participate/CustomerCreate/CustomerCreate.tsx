import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateParticipant } from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import type { UseFormSetError } from 'react-hook-form'

const CustomerEdit = () => {
    const navigate = useNavigate()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (
        values: CustomerFormSchema,
        setError: UseFormSetError<CustomerFormSchema>
    ) => {
        // console.log('🎯 handleFormSubmit STARTED with:', values)
        setIsSubmiting(true)

        try {
            const payload = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone: values.phone,
                event: values.event,
                place: values.place,
                referred_by: values.referred_by || '',
            }

            // console.log('📤 Sending to API:', payload)
            
            // ⭐ TRY-CATCH INSIDE TRY TO CATCH ALL ERRORS
            const response = await apiCreateParticipant(payload)
            // console.log('✅ API Success:', response)

            toast.push(
                <Notification type="success">
                    Participant created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/participants')
        } catch (err: any) {
            // console.log('❌ API CALL FAILED - Full error:', err)
            
            // ⭐ CHECK FOR NETWORK ERROR FIRST
            if (!err.response) {
                // console.log('🌐 Network error')
                toast.push(
                    <Notification type="danger">
                        Network error. Please check your connection.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }
            
            const errorData = err.response?.data
            // console.log('📄 Error response data:', errorData)
            // console.log('📄 Error status:', err.response?.status)
            
            // ⭐ HANDLE PHONE ERROR
            if (errorData?.phone) {
                let phoneErrorMessage = ''
                
                if (Array.isArray(errorData.phone)) {
                    phoneErrorMessage = errorData.phone[0]
                } else {
                    phoneErrorMessage = errorData.phone
                }
                
                // console.log('📱 Setting phone error:', phoneErrorMessage)
                
                // ⭐⭐ SET ERROR WITHOUT THROWING
                setError(
                    'phone',
                    {
                        type: 'server',
                        message: phoneErrorMessage,
                    },
                    {
                        shouldFocus: true,
                    }
                )
                
                // ⭐⭐ RETURN - DON'T THROW, DON'T PROPAGATE ERROR
                // console.log('🛑 Returning after setting phone error')
                return
            }
            
            // Handle other errors
            const errorMessage = errorData?.message || 
                               errorData?.detail || 
                               errorData?.error ||
                               `Error: ${err.response?.status || 'Unknown'}`
            
            // console.log('🔔 Showing toast for other error:', errorMessage)
            
            toast.push(
                <Notification type="danger">
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            )
            
            // ⭐ STILL RETURN, DON'T THROW
            // console.log('🛑 Returning after showing toast')
            return
            
        } finally {
            // console.log('🏁 Finally - setting submitting false')
            setIsSubmiting(false)
        }
        
        // console.log('🏁 handleFormSubmit COMPLETED')
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
                    event: '',
                    place: '',
                    referred_by: '',
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
                onConfirm={() => navigate('/participants')}
            >
                <p>
                    Are you sure you want to discard this? This action can&apos;t
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit