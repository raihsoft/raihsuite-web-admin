import { useEffect, useState, useRef } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
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
        setError: UseFormSetError<CustomerFormSchema>
    ) => Promise<void>
    defaultValues?: Partial<CustomerFormSchema>
    newCustomer?: boolean
    disableEvent?: boolean
} & CommonProps

// ✅ UPDATED VALIDATION SCHEMA
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
    referred_by: z.string().optional(),

    // ✅ ADD fee_amount
    fee_amount: z.string().optional(),
})

const CustomerForm = ({
    onFormSubmit,
    defaultValues,
    disableEvent,
    children,
}: CustomerFormProps) => {
    const isRestoringRef = useRef(false)

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setError,
        watch,
        clearErrors,
        setFocus,
        getValues,
    } = useForm<CustomerFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues,
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const [serverPhoneError, setServerPhoneError] = useState<string>('')

    // Watch phone field
    const phoneValue = watch('phone')

    useEffect(() => {
        if (serverPhoneError && phoneValue && !isRestoringRef.current) {
            setServerPhoneError('')
            clearErrors('phone')
        }
    }, [phoneValue, serverPhoneError, clearErrors])

    // ✅ APPLY DEFAULT VALUES ONCE
    const initialRender = useRef(true)

    useEffect(() => {
        if (initialRender.current && defaultValues && !isEmpty(defaultValues)) {
            reset(defaultValues)
            initialRender.current = false
        }
    }, [defaultValues, reset])

    const onSubmit = async (values: CustomerFormSchema) => {
        const currentValues = getValues()

        try {
            await onFormSubmit(values, (fieldName, error, options) => {
                if (fieldName === 'phone') {
                    setServerPhoneError(error.message || '')
                    setError(fieldName, error, options)

                    isRestoringRef.current = true

                    reset(
                        {
                            ...currentValues, // ✅ preserves fee_amount too
                        },
                        {
                            keepErrors: true,
                            keepDirty: true,
                            keepValues: true,
                            keepDefaultValues: true,
                        }
                    )

                    setTimeout(() => {
                        isRestoringRef.current = false
                    }, 100)

                    if (options?.shouldFocus) {
                        setTimeout(() => {
                            setFocus('phone')
                        }, 150)
                    }
                } else {
                    setError(fieldName, error, options)
                }
            })
        } catch (err) {
            // console.error('❌ Form submit error:', err)
        }
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <OverviewSection
                    control={control}
                    errors={errors}
                    serverPhoneError={serverPhoneError}
                    disableEvent={disableEvent}
                />
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
