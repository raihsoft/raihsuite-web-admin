import { useState, useEffect } from 'react'
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
import {
    apiCreateFeePayment,
    apiParticipantList,
} from '@/services/CustomersService'

/* ZOD SCHEMA */
const FeePaymentSchema = z.object({
    participant: z.string({ required_error: 'Participant required' }), // UUID
    participant_name: z.string(),
    fee_amount: z.coerce.number().default(0),
    code: z.enum(['ADVANCE', 'INSTALLMENT'], {
        required_error: 'Payment type required',
    }), 
})

type FeePaymentFormSchema = z.infer<typeof FeePaymentSchema>

const FeePaymentCreate = () => {
    const navigate = useNavigate()
    const [discardOpen, setDiscardOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [participantOptions, setParticipantOptions] = useState<any[]>([])

    const paymentOptions = [
        { label: 'Advance', value: 'ADVANCE' },
        { label: 'Installment', value: 'INSTALLMENT' },
    ]

    const { handleSubmit, control, setValue, formState: { errors } } = useForm<FeePaymentFormSchema>({
        resolver: zodResolver(FeePaymentSchema),
        defaultValues: {
            participant: '',
            participant_name: '',
            fee_amount: 0,
            code: '',
        },
    })

    /* FETCH PARTICIPANTS */
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const res: any = await apiParticipantList({})

                const options = res.results.map((item: any) => ({
                    label: `${item.first_name} ${item.event_title}`,
                    value: item.id, // ✅ send ID/UUID to backend
                    firstName: item.first_name,
                }))

                setParticipantOptions(options)
            } catch (err) {
                toast.push(
                    <Notification type="danger">
                        Failed to load participants
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        }

        fetchParticipants()
    }, [])

    const onSubmit = async (values: FeePaymentFormSchema) => {
        setIsSubmitting(true)
        try {
            console.log('📤 Payload:', values)
            await apiCreateFeePayment(values)

            toast.push(
                <Notification type="success">
                    Fee payment created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/Feepayment')
        } catch (err) {
            console.error(err)
            toast.push(
                <Notification type="danger">
                    Failed to create fee payment
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <h3 className="text-2xl font-bold mb-6">Add Fee Payment</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* PARTICIPANT */}
                    <FormItem
                        label="Participant"
                        invalid={!!errors.participant}
                        errorMessage={errors.participant?.message}
                    >
                        <Controller
                            name="participant"
                            control={control}
                            render={({ field }) => {
                                const selected = participantOptions.find(opt => opt.value === field.value) || null
                                return (
                                    <Select
                                        options={participantOptions}
                                        value={selected}
                                        placeholder="Select participant"
                                        onChange={(opt: any) => {
                                            if (!opt) return
                                            field.onChange(opt.value) // ✅ ID/UUID
                                            setValue('participant_name', opt.firstName)
                                        }}
                                    />
                                )
                            }}
                        />
                    </FormItem>

                    {/* FEE AMOUNT */}
                    <FormItem label="Fee Amount">
                        <Controller
                            name="fee_amount"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="number" placeholder="Enter fee amount" />
                            )}
                        />
                    </FormItem>

                    {/* PAYMENT TYPE */}
                    <FormItem
                        label="Payment Type"
                        invalid={!!errors.code}
                        errorMessage={errors.code?.message}
                    >
                       <Controller
    name="code"
    control={control}
    render={({ field }) => {
        const selected = paymentOptions.find(opt => opt.value === field.value) || null
        return (
            <Select
                options={paymentOptions}
                value={selected}
                placeholder="Select payment type"
                onChange={(opt) => field.onChange(opt?.value)}
            />
        )
    }}
/>

                    </FormItem>
                </div>
            </Card>

            {/* BOTTOM BAR */}
            <div className="fixed bottom-0 z-20 bg-white border-t w-full lg:left-[18.1rem] lg:w-[calc(100%-18.1rem)] p-4 flex justify-end gap-3">
                <Button
                    type="button"
                    icon={<TbTrash />}
                    onClick={() => setDiscardOpen(true)}
                    customColorClass={() =>
                        'border-error ring-1 ring-error text-error bg-transparent'
                    }
                >
                    Discard
                </Button>

                <Button type="submit" variant="solid" loading={isSubmitting}>
                    Create
                </Button>
            </div>

            <ConfirmDialog
                isOpen={discardOpen}
                type="danger"
                title="Discard fee payment?"
                onClose={() => setDiscardOpen(false)}
                onCancel={() => setDiscardOpen(false)}
                onConfirm={() => navigate('/Feepayment')}
            >
                <p>This action cannot be undone.</p>
            </ConfirmDialog>
        </form>
    )
}

export default FeePaymentCreate
