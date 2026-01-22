import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import AccountSection from './AccountSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { CustomerFormSchema } from './types'

type CustomerFormProps = {
    onFormSubmit: (values: CustomerFormSchema) => void
    defaultValues?: Partial<CustomerFormSchema> // ✅ FIX
    newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<CustomerFormSchema> = z.object({

    participants_name: z.string().min(1, { message: 'Participant name required' }),
    fee_amount: z.string().min(1, { message: 'Fee amount required' }),
    payment_type: z.string().min(1, { message: 'Payment type required' }),
})


const CustomerForm = (props: CustomerFormProps) => {
    const {
        onFormSubmit,
        defaultValues,
        newCustomer = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<CustomerFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: defaultValues || {
           
            pariticipant_name: '',
            fee_amount: '',
            payment_type: '',
        },
    })

    useEffect(() => {
        if (defaultValues && !isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        <OverviewSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
