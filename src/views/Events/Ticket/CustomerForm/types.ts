import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    event?: string
    participant?: string
}

export type CustomerFormSchema = OverviewFields

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
