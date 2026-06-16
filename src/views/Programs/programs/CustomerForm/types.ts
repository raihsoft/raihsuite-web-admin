import type { Control, FieldErrors } from 'react-hook-form'

export type CustomerFormSchema = {
    name: string
    code: string
    description: string
    start_date: string
    end_date: string
}

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}

export type ParticipantCustomFieldOption = {
    id?: string
    label: string
    value: string
    order: number
    is_active?: boolean
}

export type ParticipantCustomField = {
    id?: string
    program?: string
    field_key: string
    label: string
    field_type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'textarea'
    is_required: boolean
    placeholder?: string
    order: number
    is_active?: boolean
    options?: ParticipantCustomFieldOption[]
}
