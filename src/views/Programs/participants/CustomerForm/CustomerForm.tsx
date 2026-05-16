import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
    program: z.string().min(1),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    place: z.string().min(1),
})

const CustomerForm = ({ defaultValues = {}, programOptions = [], children, onFormSubmit }: any) => {
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues,
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) reset(defaultValues)
    }, [defaultValues])

    const onSubmit = (values: any) => {
        console.log('🔥 FORM SUBMIT:', values)
        onFormSubmit(values)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <OverviewSection
                    control={control}
                    errors={errors}
                    programOptions={programOptions}   // ✅ CRITICAL FIX
                />
            </Container>

            <BottomStickyBar>
                {children}
            </BottomStickyBar>
        </Form>
    )
}

export default CustomerForm