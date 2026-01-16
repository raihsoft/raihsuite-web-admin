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
    event: z.string().min(1, { message: 'Event required' }),
    // event_title: z.string().min(1, { message: 'Event title required' }),
    title: z.string().min(1, { message: 'Title required' }),
    start_datetime: z.string().min(1, { message: 'Start date & time required' }),
    end_datetime: z.string().min(1, { message: 'End date & time required' }),
    day: z.string().min(1, { message: 'Day required' }),
    speaker: z.string().min(1, { message: 'Speaker required' }),
    location: z.string().min(1, { message: 'Location required' }),
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
            event: '',
            event_title: '',
            title: '',
            start_datetime: '',
            end_datetime: '',
            day: '',
            speaker: '',
            location: '',
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
