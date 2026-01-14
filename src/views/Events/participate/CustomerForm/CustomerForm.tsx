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
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    phone: z.string().min(1, { message: 'Phone required' }),
    event: z.string().min(1, { message: 'Event required' }),
    place: z.string().min(1, { message: 'Place required' }),
    referred_by: z.string().optional(), // ✅ OK
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
        defaultValues: {
            banAccount: false,
            accountVerified: true,
            ...defaultValues, // ✅ SAFE MERGE
        },
    })

    useEffect(() => {
        if (defaultValues && !isEmpty(defaultValues)) {
            reset({
                banAccount: false,
                accountVerified: true,
                ...defaultValues,
            })
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
