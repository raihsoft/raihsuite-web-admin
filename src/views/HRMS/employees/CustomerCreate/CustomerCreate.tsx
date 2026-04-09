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
import { apiCreateEmployee } from '@/services/CustomersService' // import POST API
import { mutate } from 'swr'
import { useCustomerListStore } from '../CustomerList/store/customerListStore' 

const CustomerEdit = () => {
    const navigate = useNavigate()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        try {
            setIsSubmiting(true)

            // payload map if needed
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

            let response
            // If img is a File, upload as multipart/form-data
            if (values.img && values.img instanceof File) {
                const formData = new FormData()
                Object.entries(payload).forEach(([k, v]) => formData.append(k, v as any))
                formData.append('img', values.img)
                // Use ApiService directly to avoid typing issues
                response = await import('@/services/ApiService').then((m) =>
                    m.default.fetchDataWithAxios({ url: '/hrms/employees/', method: 'post', data: formData } as any),
                )
            } else {
                response = await apiCreateEmployee(payload)
            }
            // console.log("Created employee:", response.data)

            // revalidate employees list
            const { tableData, filterData } = useCustomerListStore.getState()
            await mutate(['/api/employees', { ...tableData, ...filterData }])

            toast.push(
                <Notification type="success">
                    Employee created successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            navigate('/employees')
        } catch (error) {
            // console.error(error)
            toast.push(
                <Notification type="danger">
                    Failed to create employee!
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
