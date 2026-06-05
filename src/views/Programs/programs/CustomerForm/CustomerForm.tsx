import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { CustomFieldsSection } from './CustomFieldsSection'
import type { ParticipantCustomField } from './types'
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
    defaultCustomFields = [],
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

    const [customFields, setCustomFields] = useState<ParticipantCustomField[]>([])

    const defaultValuesStr = JSON.stringify(defaultValues)
    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValuesStr, reset])

    const defaultCustomFieldsStr = JSON.stringify(defaultCustomFields)
    useEffect(() => {
        if (defaultCustomFields) {
            setCustomFields(defaultCustomFields)
        }
    }, [defaultCustomFieldsStr])

    const onSubmit = (values: any) => {
        console.log(
            '🔥 FORM SUBMIT:',
            values,
            'CUSTOM FIELDS:',
            customFields
        )

        onFormSubmit?.({
            ...values,
            customFields,
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container className="space-y-6 pb-24">
                <OverviewSection
                    control={control}
                    errors={errors}
                />
                <CustomFieldsSection
                    fields={customFields}
                    onChange={setCustomFields}
                />
            </Container>

            <BottomStickyBar>
                {children}
            </BottomStickyBar>
        </form>
    )
}

export default CustomerForm