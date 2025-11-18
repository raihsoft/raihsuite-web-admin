import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { Button } from '@/components/ui/Button'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { CustomerFormSchema } from './types'
import { apiCreateAssets } from '@/services/CustomersService'

// 🔹 Props
type CustomerFormProps = {
    defaultValues?: CustomerFormSchema
    newCustomer?: boolean
} & CommonProps

// 🔹 Validation Schema
const validationSchema: ZodType<CustomerFormSchema> = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    file_type: z.string().min(1, { message: 'File Type is required' }),
    asset_type_ref: z.string().min(1, { message: 'Asset Type is required' }),
    asset_category: z.string().min(1, { message: 'Asset Category is required' }),
    tags: z.string().optional(),
    file: z.any().refine((file) => file instanceof File, {
        message: 'File is required',
    }),
})

const CustomerForm = (props: CustomerFormProps) => {
    const { defaultValues = {}, newCustomer = false, children } = props

    // 🟢 useForm init
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CustomerFormSchema>({
        defaultValues: {
            banAccount: false,
            accountVerified: true,
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    // 🔄 Reset default values when editing
    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    // 🟢 SUBMIT HANDLER — FINAL FIXED VERSION
    const onSubmit = async (values: CustomerFormSchema) => {
        console.log('🟢 SUBMITTED VALUES:', values)

        try {
            // 🧩 Get tenant from localStorage
            const tenant = localStorage.getItem('tenant')

            if (!tenant) {
                alert('Tenant not found — Please login again.')
                return
            }

            // 🧩 Prepare FormData
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('description', values.description)
            formData.append('file_type', values.file_type)
            formData.append('asset_type_ref', values.asset_type_ref)
            formData.append('asset_category', values.asset_category)
            formData.append('tags', values.tags || '')

            if (values.file) {
                formData.append('file', values.file)
            }

            // 🟢 Attach tenant
            formData.append('tenant', tenant)

            // 🚀 API CALL
            const res = await apiCreateAssets(formData)
            console.log('✅ Asset Created Successfully:', res)

            alert('Asset Created Successfully!')
        } catch (error) {
            console.error('❌ Asset Create Error:', error)
            alert('Error creating asset.')
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

            <BottomStickyBar>
                {/* <Button type="submit" variant="solid" color="blue">
                    Submit Asset
                </Button> */}
                {children}
            </BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
