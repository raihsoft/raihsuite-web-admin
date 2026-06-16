import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { apiGetParticipantCustomFields } from '@/services/CustomersService'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import type { ParticipantCustomFieldOption } from '../../programs/CustomerForm/types'

const schema = z.object({
    program: z.string().min(1),
    first_name: z.string().min(1, { message: 'Name is required' }),
    last_name: z.string().optional().nullable(),
    email: z.string().email(),
    phone: z.string().min(1),
    place: z.string().min(1),
    custom_data: z.record(z.any()).optional(),
})

const CustomerForm = ({ defaultValues = {}, programOptions = [], newCustomer = true, children, onFormSubmit }: any) => {
    const { handleSubmit, control, reset, watch, formState: { errors } } = useForm({
        defaultValues,
        resolver: zodResolver(schema),
    })

    const selectedProgram = watch('program')

    const { data: customFieldsResponse } = useSWR(
        selectedProgram ? ['/programs/participant-custom-fields', { program: selectedProgram }] : null,
        () => apiGetParticipantCustomFields<any, { program: string }>({ program: selectedProgram! }),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const customFields = (customFieldsResponse?.results ?? [])
        .filter((field: any) => {
            const fieldProgId = field.program && typeof field.program === 'object' ? field.program.id : (field.program || field.program_id)
            return String(fieldProgId) === String(selectedProgram)
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
                <div className="flex flex-col gap-6">
                    <OverviewSection
                        control={control}
                        errors={errors}
                        programOptions={programOptions}   // ✅ CRITICAL FIX
                        newCustomer={newCustomer}
                    />

                    {customFields.length > 0 && (
                        <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <h4 className="mb-6 font-bold text-gray-900 dark:text-gray-100">Additional Fields</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {customFields.map((field: any) => {
                                    return (
                                        <FormItem
                                            key={field.id || field.field_key}
                                            label={field.label}
                                            asterisk={field.is_required}
                                            errorMessage={(errors.custom_data as any)?.[field.field_key]?.message}
                                        >
                                            <Controller
                                                name={`custom_data.${field.field_key}`}
                                                control={control}
                                                rules={{
                                                    required: field.is_required ? `${field.label} is required` : false
                                                }}
                                                render={({ field: inputField }) => {
                                                    switch (field.field_type) {
                                                        case 'select':
                                                            return (
                                                                <Select
                                                                    isClearable={!field.is_required}
                                                                    options={field.options?.map((opt: any) => ({ label: opt.label, value: opt.value })) || []}
                                                                    placeholder={field.placeholder || `Select ${field.label}...`}
                                                                    value={
                                                                        field.options
                                                                            ?.map((opt: any) => ({ label: opt.label, value: opt.value }))
                                                                            .find((opt: any) => opt.value === inputField.value) || null
                                                                    }
                                                                    onChange={(opt: any) => inputField.onChange(opt?.value || '')}
                                                                />
                                                            );
                                                        case 'textarea':
                                                            return (
                                                                <Input
                                                                    textArea
                                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                                    {...inputField}
                                                                    value={inputField.value || ''}
                                                                />
                                                            );
                                                        case 'checkbox':
                                                            if (field.options && field.options.length > 0) {
                                                                return (
                                                                    <div className="flex flex-col gap-2 mt-1">
                                                                        {field.options.map((opt: any) => {
                                                                            const currentVals = Array.isArray(inputField.value)
                                                                                ? inputField.value
                                                                                : (inputField.value ? [String(inputField.value)] : []);
                                                                            const isChecked = currentVals.includes(opt.value);

                                                                            return (
                                                                                <Checkbox
                                                                                    key={opt.id || opt.value}
                                                                                    checked={isChecked}
                                                                                    onChange={(checked) => {
                                                                                        let nextVals: string[];
                                                                                        if (checked) {
                                                                                            nextVals = [...currentVals, opt.value];
                                                                                        } else {
                                                                                            nextVals = currentVals.filter((v: string) => v !== opt.value);
                                                                                        }
                                                                                        inputField.onChange(nextVals);
                                                                                    }}
                                                                                >
                                                                                    {opt.label}
                                                                                </Checkbox>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div className="flex items-center h-10">
                                                                        <Checkbox
                                                                            checked={!!inputField.value}
                                                                            onChange={(checked) => inputField.onChange(checked)}
                                                                        >
                                                                            {field.placeholder || `Yes, ${field.label}`}
                                                                        </Checkbox>
                                                                    </div>
                                                                );
                                                            }
                                                        case 'number':
                                                            return (
                                                                <Input
                                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                                    type="number"
                                                                    {...inputField}
                                                                    value={inputField.value ?? ''}
                                                                    onChange={(e) => inputField.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                                                />
                                                            );
                                                        case 'email':
                                                            return (
                                                                <Input
                                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                                    type="email"
                                                                    {...inputField}
                                                                    value={inputField.value || ''}
                                                                />
                                                            );
                                                        case 'phone':
                                                            return (
                                                                <Input
                                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                                    type="tel"
                                                                    {...inputField}
                                                                    value={inputField.value || ''}
                                                                />
                                                            );
                                                        case 'date':
                                                            return (
                                                                <Input
                                                                    placeholder={field.placeholder || `Select ${field.label}`}
                                                                    type="date"
                                                                    {...inputField}
                                                                    value={inputField.value || ''}
                                                                />
                                                            );
                                                        case 'text':
                                                        default:
                                                            return (
                                                                <Input
                                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                                    type="text"
                                                                    {...inputField}
                                                                    value={inputField.value || ''}
                                                                />
                                                            );
                                                    }
                                                }}
                                            />
                                        </FormItem>
                                    );
                                })}
                            </div>
                        </Card>
                    )}
                </div>
            </Container>

            <BottomStickyBar>
                {children}
            </BottomStickyBar>
        </Form>
    )
}

export default CustomerForm