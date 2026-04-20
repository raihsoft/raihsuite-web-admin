import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import { apiCreateEmployee } from '@/services/CustomersService'
import { mutate } from 'swr'
import { useCustomerListStore } from '../CustomerList/store/customerListStore'

const CustomerEdit = () => {
    const navigate = useNavigate()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        try {
            setIsSubmiting(true)

            const payload = {
                name: values.name,
                email_link: values.email_link,
                designation: values.designation,
                organization: values.organization,
                facebook_link: values.facebook_link,
                instagram_link: values.instagram_link,
                youtube_link: values.youtube_link,
                linkedin_link: values.linkedin_link,
                website_link: values.website_link,
            }

            await apiCreateEmployee(payload)

            // refresh list
            const { tableData, filterData } = useCustomerListStore.getState()
            await mutate(['/api/employees', { ...tableData, ...filterData }])

            toast.push(
                <Notification type="success">
                    Employee created successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            navigate('/employees')

        } catch (error: any) {
            console.error("API Error:", error)

            let errorMessages: string[] = []

            // ✅ Handle backend validation errors
            if (error?.response?.data) {
                const data = error.response.data

                const fieldLabels: Record<string, string> = {
                    facebook_link: "Facebook",
                    youtube_link: "YouTube",
                    instagram_link: "Instagram",
                    linkedin_link: "LinkedIn",
                    website_link: "Website",
                    email_link: "Email",
                    name: "Name",
                    designation: "Designation",
                    organization: "Organization",
                }

                Object.keys(data).forEach((field) => {
                    const messages = data[field]

                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => {
                            const label = fieldLabels[field] || field
                            errorMessages.push(`${label}: ${msg}`)
                        })
                    } else if (typeof messages === 'string') {
                        const label = fieldLabels[field] || field
                        errorMessages.push(`${label}: ${messages}`)
                    }
                })
            }

            // fallback
            if (errorMessages.length === 0) {
                errorMessages.push('Failed to create employee!')
            }

            // ✅ Show all errors in toast
            toast.push(
                <Notification type="danger">
                    <div className="space-y-1">
                        {errorMessages.map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                    </div>
                </Notification>,
                { placement: 'top-center' },
            )

        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="warning">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/employees')
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
                    name: '',
                    email_link: '',
                    designation: '',
                    organization: '',
                    facebook_link: '',
                    instagram_link: '',
                    youtube_link: '',
                    linkedin_link: '',
                    website_link: '',
                    img: '',
                    tags: [],
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
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit