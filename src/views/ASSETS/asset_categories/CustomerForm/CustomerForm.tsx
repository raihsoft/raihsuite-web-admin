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
import { apiCreateAssetCategories, apiCreateAssets } from '@/services/CustomersService'   // 🔹 Change API if needed

// 🔹 Props
type CustomerFormProps = {
    defaultValues?: CustomerFormSchema
    newCustomer?: boolean
} & CommonProps

type CustomerFormPropsWithSubmit = CustomerFormProps & {
    onFormSubmit?: (values: CustomerFormSchema) => Promise<void> | void
}

// 🔹 Validation Schema
const validationSchema: ZodType<CustomerFormSchema> = z.object({
    name: z.string().min(1, { message: 'Name required' }),
    code: z.string().min(1, { message: 'Code required' }),
    title: z.string().min(1, { message: 'Title required' }),
    description: z.string().min(1, { message: 'Description required' }),
})

const CustomerForm = (props: CustomerFormPropsWithSubmit) => {
    const { defaultValues = {}, newCustomer = false, children } = props

    // 🟢 useForm init
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

    // 🔄 Reset when editing
    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    // 🟢 SUBMIT Handler — Copy of your first code logic
    const onSubmit = async (values: CustomerFormSchema) => {
        // If parent provided an onFormSubmit (edit page), use it.
        if (props.onFormSubmit) {
            await props.onFormSubmit(values)
            return
        }

        try {
            // 🧩 Get tenant
            const tenant = localStorage.getItem('tenant')

            if (!tenant) {
                return
            }

            // 🧩 Prepare FormData
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('code', values.code)
            formData.append('title', values.title)
            formData.append('description', values.description)

            // Attach tenant
            formData.append('tenant', tenant)

            // 🚀 API CALL
            const res = await apiCreateAssetCategories(formData)
                    // console.log('✅ API Response:', res)

            alert('Customer Created Successfully!')
        } catch (error) {
            // console.error('❌ Create Error:', error)
            alert('Error creating customer.')
        }
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
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
