import { useEffect } from 'react'
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
import { apiCreateAssets } from '@/services/CustomersService'
import { apiCreateAssetType } from '@/services/CustomersService'

type CustomerFormProps = {
    defaultValues?: CustomerFormSchema
    newCustomer?: boolean
    onFormSubmit?: (values: CustomerFormSchema) => Promise<void> | void
} & CommonProps

// VALIDATION SCHEMA
const validationSchema: ZodType<CustomerFormSchema> = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    code: z.string().min(1, { message: 'Code is required' }),
    file_extension: z.string().min(1, { message: 'File extension required' }),
    description: z.string().optional(),

})

const CustomerForm = (props: CustomerFormProps) => {
    const { defaultValues = {}, newCustomer = false, children } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<CustomerFormSchema>({
        defaultValues: {
            banAccount: false,
            accountVerified: true,
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    // RESET WHEN EDITING
    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    // SUBMIT LOGIC LIKE FIRST FORM
    const onSubmit = async (values: CustomerFormSchema) => {
        // If parent provided an onFormSubmit (edit page), use it.
        if (props.onFormSubmit) {
            await props.onFormSubmit(values)
            return
        }

        // Otherwise handle create locally
        try {
            const tenant = localStorage.getItem('tenant')
            if (!tenant) {
                alert('Tenant not found — Please login again.')
                return
            }

            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('code', values.code)
            formData.append('file_extension', values.file_extension)
            formData.append('description', values.description || '')
            formData.append('tenant', tenant)

            const res = await apiCreateAssetType(formData)
            console.log('SUCCESS:', res)
            alert('Created Successfully!')
        } catch (err) {
            console.error('ERROR:', err)
            alert('Failed to create item.')
        }
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col gap-4">
                    <OverviewSection control={control} errors={errors} />
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
