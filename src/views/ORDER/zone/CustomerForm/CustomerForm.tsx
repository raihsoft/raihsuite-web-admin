import { useEffect } from 'react'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
// import AddressSection from './AddressSection'
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
    zone_name: z.string().min(1, { message: 'Name required' }),
    
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
        defaultValues,
        resolver: zodResolver(validationSchema),
    })

    // reset only when defaultValues change AND not empty
    useEffect(() => {
        if (defaultValues && !isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values: CustomerFormSchema) => {
        onFormSubmit?.(values)

        // if it's a new customer form, clear after submit
        if (newCustomer) {
            reset()
        }
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
