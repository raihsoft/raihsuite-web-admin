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
    referred_by: z.string().optional(),
})

const CustomerForm = ({
    onFormSubmit,
    defaultValues,
    children,
}: CustomerFormProps) => {
    // console.log('🔁 CustomerForm RENDERED')
    
    // ⭐ USE REF TO PREVENT MULTIPLE SETS
    const isRestoringRef = useRef(false)
    
    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
        setError,
        watch,
        clearErrors,
        setFocus,
        getValues,
    } = useForm<CustomerFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues,
        // ⭐ CRITICAL: Don't re-validate on change
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const [serverPhoneError, setServerPhoneError] = useState<string>('')

    // Watch ALL fields
    const allValues = watch()
    // console.log('👀 CURRENT FORM VALUES:', allValues)

    // Watch phone field
    const phoneValue = watch('phone')
    
    useEffect(() => {
        // console.log('📱 Phone value changed:', phoneValue)
        if (serverPhoneError && phoneValue && !isRestoringRef.current) {
            // console.log('🧹 Clearing phone error')
            setServerPhoneError('')
            clearErrors('phone')
        }
    }, [phoneValue, serverPhoneError, clearErrors])

    // ⭐ SKIP DEFAULT VALUES AFTER FIRST RENDER
    const initialRender = useRef(true)
    
    useEffect(() => {
        // console.log('⚙️ Default values effect running')
        if (initialRender.current && defaultValues && !isEmpty(defaultValues)) {
            // console.log('📝 Setting initial default values')
            reset(defaultValues)
            initialRender.current = false
        }
    }, [defaultValues, reset])

    const onSubmit = async (values: CustomerFormSchema) => {
        // console.log(' FORM SUBMITTED WITH VALUES:', values)
        
        // Get current values BEFORE submit
        const currentValues = getValues()
        // console.log(' CURRENT VALUES IN FORM:', currentValues)
        
        try {
            await onFormSubmit(values, (fieldName, error, options) => {
                // console.log(' onFormSubmit callback - field:', fieldName)
                
                if (fieldName === 'phone') {
                    // console.log(' Setting server phone error:', error.message)
                    
                    // Set the error states
                    setServerPhoneError(error.message || '')
                    setError(fieldName, error, options)
                    
                    // ⭐⭐ MARK THAT WE'RE RESTORING
                    isRestoringRef.current = true
                    
                    // ⭐⭐ RESTORE ALL VALUES PROPERLY
                    // console.log(' RESTORING VALUES:', currentValues)
                    reset({
                        ...currentValues,
                        phone: currentValues.phone, // Keep the entered phone
                    }, {
                        keepErrors: true,     // Keep phone error
                        keepDirty: true,      // Keep dirty state
                        keepValues: true,     // Keep all values
                        keepDefaultValues: true, // Keep defaults
                    })
                    
                    // Reset the flag after restore
                    setTimeout(() => {
                        isRestoringRef.current = false
                        // console.log(' Restore complete')
                    }, 100)
                    
                    if (options?.shouldFocus) {
                        setTimeout(() => {
                            // console.log(' Focusing on phone field')
                            setFocus('phone')
                        }, 150)
                    }
                } else {
                    setError(fieldName, error, options)
                }
            })
        } catch (err) {
            console.log('❌ Form submit caught error:', err)
            // Don't do anything here - error should be handled in onFormSubmit
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
                />
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm