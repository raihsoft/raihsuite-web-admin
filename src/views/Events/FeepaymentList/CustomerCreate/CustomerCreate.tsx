import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import FormItem from '@/components/ui/Form/FormItem'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { apiCreateFeePayment } from '@/services/CustomersService'

// ---------------------------
// Form schema with Zod
// ---------------------------
const FeePaymentSchema = z.object({
    participant_name: z.string().min(1, { message: 'Participant name required' }),
    fee_amount: z.string().min(1, { message: 'Fee amount required' }),
    payment_type: z.string().min(1, { message: 'Payment type required' }),
})

export type FeePaymentFormSchema = z.infer<typeof FeePaymentSchema>

// ---------------------------
// Hardcoded payment options
// ---------------------------
const paymentOptions = [
    { label: 'Advance', value: 'Advance' },
    { label: 'Installment', value: 'Installment' },
]

// ---------------------------
// Main Create Page
// ---------------------------
const FeePaymentCreate = () => {
    const navigate = useNavigate()

    const [discardOpen, setDiscardOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { handleSubmit, control, formState: { errors } } = useForm<FeePaymentFormSchema>({
        resolver: zodResolver(FeePaymentSchema),
        defaultValues: {
            participant_name: '',
            fee_amount: '',
            payment_type: '',
        },
    })

    // ---------------------------
    // Form Submit
    // ---------------------------
    const onSubmit = async (values: FeePaymentFormSchema) => {
        setIsSubmitting(true)
        try {
            await apiCreateFeePayment(values)
            toast.push(
                <Notification type="success">Fee payment created successfully!</Notification>,
                { placement: 'top-center' }
            )
            navigate('/Feepayment')
        } catch (err) {
            toast.push(
                <Notification type="danger">Failed to create fee payment</Notification>,
                { placement: 'top-center' }
            )
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // ---------------------------
    // Discard Handlers
    // ---------------------------
    const handleDiscard = () => setDiscardOpen(true)
    const handleConfirmDiscard = () => { setDiscardOpen(false); navigate('/Feepayment') }
    const handleCancelDiscard = () => setDiscardOpen(false)

    return (
<form onSubmit={handleSubmit(onSubmit)}>
    <Card>
        <h3 className="text-2xl font-bold mb-6">Add Fee Payment</h3>

        <div className="grid md:grid-cols-2 gap-4">

            {/* Participant Name */}
            <FormItem
                label="Participant Name"
                invalid={!!errors.participant_name}
                errorMessage={errors.participant_name?.message}
            >
                <Controller
                    name="participant_name"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter participant name" />
                    )}
                />
            </FormItem>

            {/* Fee Amount */}
            <FormItem
                label="Fee Amount"
                invalid={!!errors.fee_amount}
                errorMessage={errors.fee_amount?.message}
            >
                <Controller
                    name="fee_amount"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Enter fee amount" />
                    )}
                />
            </FormItem>

            {/* Payment Type */}
            <FormItem
                label="Payment Type"
                invalid={!!errors.payment_type}
                errorMessage={errors.payment_type?.message}
            >
                <Controller
                    name="payment_type"
                    control={control}
                    render={({ field }) => {
                        const selectedOption = paymentOptions.find(
                            (opt) => opt.value === field.value
                        ) || null
                        return (
                            <Select
                                options={paymentOptions}
                                value={selectedOption}
                                onChange={(option) => field.onChange(option?.value)}
                                placeholder="Select payment type"
                                isClearable={false}
                            />
                        )
                    }}
                />
            </FormItem>
        </div>
    </Card>

    {/* Buttons fixed at bottom */}
  <div
  className="
        fixed bottom-0 z-20
    bg-white dark:bg-gray-900
    border-t border-gray-200 dark:border-gray-700
    w-full
    lg:left-[18.1rem] lg:w-[calc(100%-18.1rem)]
    p-4 flex justify-end gap-3
  "
>
    <Button
        type="button"
        icon={<TbTrash />}
        onClick={handleDiscard}
        customColorClass={() =>
            'border-error ring-1 ring-error text-error bg-transparent hover:bg-transparent dark:hover:bg-transparent hover:text-error hover:ring-error hover:border-error'
        }
    >
        Discard
    </Button>

    <Button type="submit" variant="solid" loading={isSubmitting}>
        Create
    </Button>
</div>

    {/* Discard Confirmation */}
    <ConfirmDialog
        isOpen={discardOpen}
        type="danger"
        title="Discard fee payment?"
        onClose={handleCancelDiscard}
        onCancel={handleCancelDiscard}
        onConfirm={handleConfirmDiscard}
    >
        <p>This action cannot be undone.</p>
    </ConfirmDialog>
</form>

    )
}

export default FeePaymentCreate
