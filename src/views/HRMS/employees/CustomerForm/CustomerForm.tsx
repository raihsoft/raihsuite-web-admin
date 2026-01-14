import { useEffect } from 'react'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import ProfileImageSection from './ProfileImageSection'
// import AddressSection from './AddressSection'
// import TagsSection from './TagsSection'
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
    name: z.string().min(1, { message: 'Name required' }),
    email_link: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    designation: z.string().min(1, { message: 'Designation required' }),
    organization: z.string().min(1, { message: 'Organization required' }),
    facebook_link: z.string().optional(),
    instagram_link: z.string().optional(),
    youtube_link: z.string().optional(),
    linkedin_link: z.string().optional(),
    website_link: z.string().optional(),
    phone: z.string().optional(),
    img: z.any().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    tags: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    tenant: z.string().optional(),
    banAccount: z.boolean().optional(),
    accountVerified: z.boolean().optional(),
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
        onFormSubmit?.(values)
    }

    return (
        <form
            className="flex w-full h-full flex-col justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} />
                        {/* <AddressSection control={control} errors={errors} /> */}
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ProfileImageSection control={control} errors={errors} />
                        {/* other right-side sections (tags/account) can go here */}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </form>
    )
}

export default CustomerForm
