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
import type { UseFormSetError } from 'react-hook-form'

type CustomerFormProps = {
    onFormSubmit: (
        values: CustomerFormSchema, 
        setError: UseFormSetError<CustomerFormSchema> // ⭐ Add this
    ) => void
    defaultValues?: CustomerFormSchema
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
})

const CustomerForm = (props: CustomerFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        newCustomer = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setError, // ⭐ Get setError from useForm
    } = useForm<CustomerFormSchema>({
        defaultValues: {
            ...{
                banAccount: false,
                accountVerified: true,
            },
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: CustomerFormSchema) => {
        // ⭐ Pass setError to onFormSubmit
        onFormSubmit?.(values, setError)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        {!newCustomer && (
                            <AccountSection control={control} errors={errors} />
                        )}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm