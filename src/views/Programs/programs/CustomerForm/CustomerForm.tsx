import { useEffect } from 'react'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    description: z.string().min(1),
    start_date: z.string().min(1),
    end_date: z.string().min(1),
})

const CustomerForm = ({
    defaultValues = {},
    children,
    onFormSubmit,
}: any) => {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,

        resolver: zodResolver(schema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values: any) => {
        console.log(
            '🔥 FORM SUBMIT:',
            values,
        )

        onFormSubmit?.(values)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <OverviewSection
                    control={control}
                    errors={errors}
                />
            </Container>

            <BottomStickyBar>
                {children}
            </BottomStickyBar>
        </form>
    )
}

export default CustomerForm