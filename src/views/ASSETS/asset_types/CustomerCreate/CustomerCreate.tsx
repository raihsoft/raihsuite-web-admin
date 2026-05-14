import { useState, useRef } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import { apiCreateAssetType } from '@/services/CustomersService'
import { mutate } from 'swr'
import { useCustomerListStore } from '../AssetTypeList/store/customerListStore'

type FormRef = {
    setError: (name: keyof CustomerFormSchema, error: { message: string }) => void
}

const CustomerEdit = () => {
    const navigate = useNavigate()
    const formRef = useRef<FormRef>(null)

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        setIsSubmiting(true)

        try {
            // ✅ CLEAN PAYLOAD (NO TENANT, NO FormData)
            const payload = {
                name: values.name,
                code: values.code,
                file_extension: values.file_extension,
                description: values.description || '',
                tags: values.tags || [],
            }

            await apiCreateAssetType(payload)

            const { tableData, filterData } =
                useCustomerListStore.getState()

            await mutate([
                '/api/asset_types',
                { ...tableData, ...filterData },
            ])

            toast.push(
                <Notification type="success">
                    Asset type created!
                </Notification>,
                { placement: 'top-center' },
            )

            navigate('/assettypes')
        } catch (err: any) {
            console.log('Error:', err)
            let message = err?.response?.data?.message || err?.response?.data || err?.message || 'Create failed!'
            
            // Handle Django-style errors: { code: ["error message"] }
            if (typeof message === 'object' && message.code && Array.isArray(message.code)) {
                message = message.code[0]
            }
            
            console.log('Extracted message:', message)
            
            if (typeof message === 'string' && message.toLowerCase().includes('already exists')) {
                formRef.current?.setError('code', { message })
            } else {
                toast.push(
                    <Notification type="danger">
                        {typeof message === 'string' ? message : 'Create failed!'}
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)

        toast.push(
            <Notification type="warning">
                Changes discarded!
            </Notification>,
            { placement: 'top-center' },
        )

        navigate('/assettypes')
    }

    return (
        <>
            <CustomerForm
                ref={formRef}
                newCustomer
                defaultValues={{
                    name: '',
                    code: '',
                    file_extension: '',
                    description: '',
                    tags: [],
                    img: '',
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span />
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
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
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can’t
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit