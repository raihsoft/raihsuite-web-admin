import { useEffect } from 'react'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
// import AddressSection from './AddressSection'
// import TagsSection from './TagsSection'
// import ProfileImageSection from './ProfileImageSection'
// import AccountSection from './AccountSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { CustomerFormSchema } from './types'

type CustomerFormProps = {
    onFormSubmit: (values: CustomerFormSchema) => void
    defaultValues?: CustomerFormSchema
    newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<CustomerFormSchema> = z.object({
    order_by_name: z.string().min(1, { message: 'Name required' }),

    mobile: z
        .string()
        .min(1, { message: 'Mobile Number required' })
        .regex(/^[0-9]{10}$/, { message: 'Invalid Mobile Number' }),

    quantity: z
        .string()
        .min(1, { message: 'Quantity required' })
        .transform((val) => Number(val)) // convert to number
        .refine((val) => val > 0, { message: 'Quantity must be greater than 0' }),

    delivery_place: z.string().min(1, { message: 'Delivery place required' }),

    order_type: z.string().min(1, { message: 'Order type required' }),

    zone: z
        .union([
            z.string(),
            z.object({ value: z.string(), label: z.string() }),
        ])
        .transform((val) => (typeof val === 'string' ? val : val.value)),

    organization: z
        .union([
            z.string(),
            z.object({ value: z.string(), label: z.string() }),
        ])
        .transform((val) => (typeof val === 'string' ? val : val.value)),

    // ✅ is_paid must always be provided (true/false)
    is_paid: z.boolean({
        required_error: "Please select Paid or Not Paid",
    }),

    payment_reference: z.string().optional(),

    tags: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .optional(),
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
    } = useForm<CustomerFormSchema>({
        defaultValues: {
            is_paid: false, // 👈 default to Not Paid
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset({
                is_paid: false, // 👈 ensure always has value
                ...defaultValues,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: CustomerFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <form
            className="flex w-full h-full flex-col justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="gap-4 flex flex-col flex-auto">
                    <OverviewSection control={control} errors={errors} />
                    {/* <AddressSection control={control} errors={errors} /> */}
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </form>
    )
}

export default CustomerForm
